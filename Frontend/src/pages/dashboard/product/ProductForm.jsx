import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  updateProduct,
  getProductById,
} from "../../../services/productService";

import { getCategories } from "../../../services/categoryService";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: "s",
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
  const [error, setError] = useState("");

  /*  Fetch Categories  */
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

  /*  Fetch Product (Edit)  */
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const product = await getProductById(id);

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
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  /*  Submit  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Update Product" : "Create Product"}</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Product Code"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required
      />

      <input
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

      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Sold"
        value={formData.sold}
        onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      {/* ================= Categories ================= */}
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* ================= Tags ================= */}
      <input
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

      <label className="checkbox">
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
        Featured
      </label>

      {/* ================= Image Cover ================= */}
      {isEdit && existingCover && (
        <div className="image-preview">
          <p>Current Cover</p>
          <img src={existingCover.url} alt="cover" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageCover(e.target.files[0])}
      />

      {/* ================= Images ================= */}
      {isEdit && existingImages.length > 0 && (
        <div className="images-preview">
          {existingImages.map((img) => (
            <div key={img.public_id} className="image-box">
              <img src={img.url} alt="product" />
              <button
                type="button"
                onClick={async () => {
                  await updateProduct(id, {
                    imagesMode: "remove",
                    removeImageId: img.public_id,
                  });
                  setExistingImages(
                    existingImages.filter((i) => i.public_id !== img.public_id),
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

      <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    </form>
  );
}
