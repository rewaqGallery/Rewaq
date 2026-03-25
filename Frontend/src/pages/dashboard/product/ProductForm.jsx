import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  updateProduct,
  getProductById,
} from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import "../Style/AdminForms.css";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    price: "",
    priceAfterDiscount: "",
    quantity: "",
    sold: "",
    category: "",
    tags: [],
    featured: false,
  });

  const [categories, setCategories] = useState([]);
  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);
  const [existingCover, setExistingCover] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesMode, setImagesMode] = useState("replace");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        const product = res;

        setFormData({
          code: product.code || "",
          description: product.description || "",
          price: product.price || "",
          priceAfterDiscount: product.priceAfterDiscount || "",
          quantity: product.quantity || "",
          sold: product.sold || "",
          category: product.category?._id || "",
          tags: product.tags || [],
          featured: product.featured || false,
        });

        setExistingCover(product.imageCover || null);
        setExistingImages(product.images || []);
      } catch (err) {
        setErrors(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          data.append("tags", JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      data.append("imagesMode", imagesMode);

      if (imageCover) data.append("imageCover", imageCover);

      if (images.length) {
        Array.from(images).forEach((img) => data.append("images", img));
      }

      if (isEdit) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }

      navigate("/dashboard/");
    } catch (err) {
      // 1- express-validator errors
      console.log(err.data.errors[0].msg)
      if (err?.data?.errors) {
        const messages = err.data.errors.map((e) => e.msg);
        console.log(messages)
        setErrors(messages);
      }

      // 2- mongoose validation errors
      else if (err.response?.data?.error?.errors) {
        const messages = Object.values(err.response.data.error.errors).map(
          (e) => e.message,
        );

        setErrors(messages);
      } else {
        setErrors([err.response?.data?.message || "Something went wrong"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Update Product" : "Create Product"}</h2>
      {errors.length > 0 && (
        <ul className="error" role="alert">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
      <div className="form-item">
        <label htmlFor="code">Product Code</label>
        <input
          id="code"
          type="text"
          placeholder="Product Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>
      <div className="form-item">
        <label htmlFor="price">Product Price</label>
        <input
          id="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
      </div>
      <div className="form-item">
        <label htmlFor="priceAfterDiscount">Product Price After Discount</label>
        <input
          id="priceAfterDiscount"
          type="number"
          placeholder="Price After Discount"
          value={formData.priceAfterDiscount}
          onChange={(e) =>
            setFormData({
              ...formData,
              priceAfterDiscount: e.target.value,
            })
          }
        />
      </div>
      <div className="form-item">
        <label htmlFor="quantity">Product Quantity</label>
        <input
          id="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          required
        />
      </div>
      <div className="form-item">
        <label htmlFor="sold">Product Sold</label>
        <input
          id="sold"
          type="number"
          placeholder="Sold"
          value={formData.sold}
          onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
        />
      </div>
      <div className="form-item">
        <label htmlFor="description">Product Description</label>
        <textarea
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="form-item">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-item">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          placeholder="Add tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              e.preventDefault();
              setFormData({
                ...formData,
                tags: [...formData.tags, e.target.value.trim()],
              });
              e.target.value = "";
            }
          }}
        />
        <div className="tags-list">
          {formData.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    tags: formData.tags.filter((_, i) => i !== index),
                  })
                }
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
      {/* featured checkbox */}
      <div className="form-item">
        <label className="checkbox">
          Featured
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({
                ...formData,
                featured: e.target.checked,
              })
            }
          />
        </label>
      </div>

      <div className="form-item">
        <label>Image Cover</label>
        {isEdit && existingCover && (
          <div className="image-preview">
            <img src={existingCover.url} alt="cover" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageCover(e.target.files[0])}
        />
      </div>

      <div className="form-item">
        <label>Images</label>
        {isEdit && existingImages.length > 0 && (
          <div className="images-preview">
            {existingImages.map((img) => (
              <div key={img.public_id} className="image-box">
                <img src={img.url} alt="product" />
                <button
                  type="button"
                  onClick={async () => {
                    const data = new FormData();
                    data.append("imagesMode", "remove");
                    data.append("removeImageId", img.public_id);
                    await updateProduct(id, data);

                    setExistingImages(
                      existingImages.filter(
                        (i) => i.public_id !== img.public_id,
                      ),
                    );
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <select
          value={imagesMode}
          onChange={(e) => setImagesMode(e.target.value)}
        >
          <option value="replace">Replace Images</option>
          <option value="append">Add More Images</option>
        </select>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
        />
      </div>
      <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    </form>
  );
}
