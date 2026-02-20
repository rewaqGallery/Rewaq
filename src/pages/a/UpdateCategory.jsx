import React, { useState, useEffect } from "react";
import {
  getCategoryById,
  updateCategory,
} from "../../services/categoryService";
import "./style/AdminForms.css";

export default function UpdateCategory({ categoryId, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(categoryId);
        setForm({
          name: data.name,
          price: data.price,
          description: data.description,
        });
      } catch {
        setError("Failed to load category");
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    Object.keys(form).forEach((key) =>
      formData.append(key, form[key])
    );
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await updateCategory(categoryId, formData);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message || "Failed to update category");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Category</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      <textarea
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Category"}
      </button>
    </form>
  );
}
