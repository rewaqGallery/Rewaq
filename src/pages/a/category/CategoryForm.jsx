import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../../../services/categoryService";

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
  const [error, setError] = useState(""); // <-- state for error message

  useEffect(() => {
    if (!isEdit) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await getCategoryById(id);
        setFormData(res.data);
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
    setError(""); // clear previous error

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      if (isEdit) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      // show backend error message in UI
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Update Category" : "Create Category"}</h2>

      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

      <input
        type="text"
        placeholder="Category name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required={!isEdit}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required={!isEdit}
      />
      <textarea
        placeholder="description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required={!isEdit}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    </form>
  );
}
