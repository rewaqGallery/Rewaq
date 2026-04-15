const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

exports.createOne = (Model, arrOfFields, folderName) =>
  asyncHandler(async (req, res, next) => {
    let newObj = arrOfFields.reduce((acc, field) => {
      acc[field] = req.body[field];
      return acc;
    }, {});

    //upload image
    if (req?.file) {
      const result = await uploadToCloudinary(req.file.buffer, folderName);
      newObj.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (req?.files?.imageCover) {
      // console.log("imageCoverVisited");
      const result = await uploadToCloudinary(
        req.files.imageCover[0].buffer,
        folderName,
      );

      newObj.imageCover = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (req?.files?.images) {
      // console.log("imagesVisited");
      newObj.images = [];

      for (const file of req.files.images) {
        const result = await uploadToCloudinary(file.buffer, folderName);
        newObj.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const document = await Model.create(newObj);
    res.status(201).json({ data: document });
  });

exports.updateOne = (Model, arrOfFields, folderName, imagesMode = "replace") =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(new apiError("No Document For This ID", 404));
    }
    if (req.body) {
      arrOfFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          document[field] = req.body[field];
        }
      });
    }

    //* update image (req.file)
    if (req?.file) {
      // upload new image first
      const result = await uploadToCloudinary(req.file.buffer, folderName);

      // delete old image (fire & forget)
      if (document.image?.public_id) {
        cloudinary.uploader
          .destroy(document.image.public_id)
          .catch((err) =>
            console.error("Cloudinary delete failed:", err.message),
          );
      }

      document.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    //* update imageCover and images (req.files)
    if (req?.files?.imageCover) {
      // upload new image first
      const result = await uploadToCloudinary(
        req.files.imageCover[0].buffer,
        folderName,
      );

      // delete old image (fire & forget)
      if (document.imageCover?.public_id) {
        cloudinary.uploader
          .destroy(document.imageCover.public_id)
          .catch((err) =>
            console.error("Cloudinary delete failed:", err.message),
          );
      }

      document.imageCover = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    //* default mode of updating multiple images is replace (deleteAll and uplopad new images)
    if (req.body?.imagesMode) {
      imagesMode = req.body.imagesMode;
    }
    if (imagesMode == "replace") {
      if (req?.files?.images) {
        // console.log("imagesVisited");
        //delete old images
        const oldImages = [...document.images];
        document.images = [];

        if (oldImages.length >= 1) {
          oldImages.forEach((img) => {
            cloudinary.uploader
              .destroy(img.public_id)
              .catch((err) =>
                console.error("Cloudinary delete failed:", err.message),
              );
          });
        }
        for (const file of req.files.images) {
          const result = await uploadToCloudinary(file.buffer, folderName);
          document.images.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    }
    // append mode add more images over the exiting images
    else if (imagesMode == "append") {
      if (req.files.images) {
        for (const file of req.files.images) {
          const result = await uploadToCloudinary(file.buffer, folderName);
          document.images.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    }
    // remove mode delete specfic image (by send its public id in req.body.removeImageId)
    else if (imagesMode == "remove" && req.body.removeImageId) {
      const imgIndex = document.images.findIndex(
        (img) => img.public_id === req.body.removeImageId,
      );

      if (imgIndex === -1) {
        throw new apiError("Image not found", 404);
      }

      await cloudinary.uploader.destroy(req.body.removeImageId);

      document.images.splice(imgIndex, 1);
    }

    await document.save();

    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(new apiError("No Document For This ID", 404));
    }
    const imagesToDelete = [];

    if (document.image?.public_id) {
      imagesToDelete.push(document.image.public_id);
    }

    if (document.imageCover?.public_id) {
      imagesToDelete.push(document.imageCover.public_id);
    }

    if (Array.isArray(document.images)) {
      document.images.forEach((img) => {
        if (img.public_id) imagesToDelete.push(img.public_id);
      });
    }
    imagesToDelete.forEach((image) => {
      cloudinary.uploader.destroy(image).catch(() => {
        console.log("Failed to delete image from cloudinary:", image);
      });
    });

    await document.deleteOne();

    res.status(204).send();
  });

exports.getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populationOption) {
      query = query.populate(populationOption);
    }
    const document = await query;
    if (!document) return next(new apiError("No document For This Id", 404));
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    /* 
    console.log("Query Object:", req.query);
    Query Object: [Object: null prototype] { 
      'price[lte]': '100',
      'price[gte]': '20',
      keyword: 'mug',
      page: '1',
      limit: '10' 
    } {
      price: { '$lte': '100', '$gte': '20' } 
      } 
  */
    //! 1- Filtering
    let queryObj = {};
    Object.keys(req.query).forEach((key) => {
      if (key.includes("[")) {
        const [field, operator] = key.replace("]", "").split("[");
        queryObj[field] = queryObj[field] || {};
        queryObj[field][operator] = req.query[key];
      } else {
        queryObj[key] = req.query[key];
      }
    });

    const excludeFields = ["page", "limit", "fields", "sort", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in)\b/g,
      (match) => `$${match}`,
    );

    const mongoFilter = JSON.parse(queryStr);
    if (mongoFilter.featured !== undefined) {
      mongoFilter.featured = mongoFilter.featured === "true";
    }
    //! 2- Searching
    const keyword = req.query.keyword?.trim();
    let searchFilter = {};

    if (keyword && keyword.length >= 2) {
      searchFilter = { $text: { $search: keyword } };
    }

    let query = Model.find({ ...mongoFilter, ...searchFilter });

    //?for userFiltering
    if (req.filterObject) {
      query.find(req.filterObject);
    }

    //! Count after filter + search (before pagination)
    const totalResults = await Model.countDocuments({
      ...mongoFilter,
      ...searchFilter,
      ...(req.filterObject || {}), //?for userFiltering
    });

    //! 3- Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(`${sortBy} -_id`);
    } else {
      query = query.sort("-createdAt -_id");
    }

    //! 4- Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(`${fields}`);
    }

    //! 5- Pagination
    const page = Math.max(req.query.page * 1 || 1, 1);
    const limit = Math.min(req.query.limit * 1 || 10, 5000);
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    //! 6- Population
    if (populationOption) {
      query = query.populate(populationOption);
    }

    //! Execute
    const documents = await query;

    res.status(200).json({
      totalResults,
      results: documents.length,
      page,
      data: documents,
    });
  });
