import React, { useState } from "react";
import { createCategory } from "../../services/categoryService";
import "./style/AdminForms.css";

export default function AddCategory({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      await createCategory(formData);
      onSuccess && onSuccess();
      setForm({ name: "", price: "", description: "" });
      setImage(null);
    } catch (err) {
      setError(err.message || "Failed to create category");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Category</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        required
      />

      <textarea
        placeholder="Description"
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
        {loading ? "Saving..." : "Add Category"}
      </button>
    </form>
  );
}
