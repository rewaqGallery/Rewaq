import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../../../services/categoryService";
import "../Style/AdminForms.css";

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await getCategoryById(id);
        setFormData({
          name: res.data.name || "",
          price: res.data.price || 0,
          priceAfterDiscount: res.data.priceAfterDiscount || 0,
          description: res.data.description || "",
        });
      } catch (err) {
        setError(err.message || "Failed to fetch category");
      }
      setLoading(false);
    };

    fetchCategory();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("priceAfterDiscount", formData.priceAfterDiscount);
    if (image) data.append("image", image);

    try {
      if (isEdit) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }
      navigate("/dashboard/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Update Category" : "Create Category"}</h2>

      {error && (
        <p role="alert" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}
      <div className="form-item">
        <label htmlFor="name">Category Name</label>
        <input
          id="name"
          type="text"
          placeholder="Category name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required={!isEdit}
        />
      </div>
      <div className="form-item">
        <label htmlFor="price">Category Price</label>
        <input
          id="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required={!isEdit}
        />
      </div>
      <div className="form-item">
        <label htmlFor="priceAfterDiscount">
          Category Price After Discount
        </label>
        <input
          id="priceAfterDiscount"
          type="number"
          min="0"
          value={formData.priceAfterDiscount}
          onChange={(e) =>
            setFormData({ ...formData, priceAfterDiscount: e.target.value })
          }
        />
      </div>
      <div className="form-item">
        <label htmlFor="description">Category Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="category description"
          required={!isEdit}
        />
      </div>

      <div className="form-item">
        <label htmlFor="image">Category Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <button disabled={loading} aria-busy={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
