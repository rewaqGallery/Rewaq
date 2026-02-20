import React, { useState, useEffect } from "react";
import { getProductById, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import "./style/AdminForms.css"

export default function UpdateProduct({ productId, onSuccess }) {
  const [form, setForm] = useState({
    code: "",
    description: "",
    quantity: 1,
    price: 0,
    priceAfterDiscount: 0,
    category: "",
    tagsText: "",
  });
  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const prod = await getProductById(productId);
      setForm({
        code: prod.code,
        description: prod.description,
        quantity: prod.quantity,
        price: prod.price,
        priceAfterDiscount: prod.priceAfterDiscount,
        category: prod.category?._id || "",
        tagsText: prod.tagsText || "",
      });
      const cats = await getCategories();
      setCategories(cats.data);
    };
    fetchData();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageCover) formData.append("imageCover", imageCover);
    if (images.length) Array.from(images).forEach(img => formData.append("images", img));

    setLoading(true);
    try {
      await updateProduct(productId, formData);
      alert("Product updated!");
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Product</h2>
      <input type="text" placeholder="Code" value={form.code} onChange={(e) => setForm({...form, code:e.target.value})} required />
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description:e.target.value})} />
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({...form, quantity:e.target.value})} />
      <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price:e.target.value})} />
      <input type="number" placeholder="Price After Discount" value={form.priceAfterDiscount} onChange={(e) => setForm({...form, priceAfterDiscount:e.target.value})} />
      <select value={form.category} onChange={(e) => setForm({...form, category:e.target.value})} required>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input type="text" placeholder="Tags (comma separated)" value={form.tagsText} onChange={(e) => setForm({...form, tagsText:e.target.value})} />
      <input type="file" onChange={(e) => setImageCover(e.target.files[0])} />
      <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
      <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Product"}</button>
    </form>
  );
}
