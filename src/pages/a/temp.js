import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { getCategories, deleteCategory } from "../services/categoryService";
import {
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  deleteOrder,
} from "../services/orderService";
import { getUsers, deleteUser } from "../services/userService";
import "./style/Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h3>Admin Panel</h3>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </aside>

      <main className="dashboard-content">
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "categories" && <CategoriesManager />}
        {activeTab === "orders" && <OrdersManager />}
        {activeTab === "users" && <UsersManager />}
      </main>
    </div>
  );
}

/* ===================== Pagination Component ===================== */
function Pagination({ page, setPage, totalResults, limit }) {
  const totalPages = Math.ceil(totalResults / limit);
  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}

/* ===================== Products Manager ===================== */
function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await getProducts(`?${params.toString()}`);
      setProducts(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <>
      <h2>Manage Products</h2>
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
          <option value="price">Price Low-High</option>
          <option value="-price">Price High-Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.code}</td>
                  <td>${p.price}</td>
                  <td>{p.category?.name}</td>
                  <td>
                    <button>Edit</button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={filters.page}
            setPage={(p) => setFilters({ ...filters, page: p })}
            totalResults={totalResults}
            limit={filters.limit}
          />
        </>
      )}
    </>
  );
}

/* ===================== Categories Manager ===================== */
function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await getCategories(`?${params.toString()}`);
      setCategories(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <>
      <h2>Manage Categories</h2>

      {/* Filter + Sort */}
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
          <option value="price">Price Low-High</option>
          <option value="-price">Price High-Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Categories Table */}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>${c.price}</td>
                  <td>
                    <button>Edit</button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            page={filters.page}
            setPage={(p) => setFilters({ ...filters, page: p })}
            totalResults={totalResults}
            limit={filters.limit}
          />
        </>
      )}
    </>
  );
}
/* ===================== Orders Manager ===================== */
function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await getOrders(`?${params.toString()}`);
      setOrders(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleAction = async (id, action) => {
    if (action === "paid") await updateOrderToPaid(id);
    if (action === "delivered") await updateOrderToDelivered(id);
    if (action === "cancel") await cancelOrder(id);
    if (action === "delete") await deleteOrder(id);
    fetchOrders();
  };

  return (
    <>
      <h2>Manage Orders</h2>
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by ID or User..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.user}</td>
                  <td>${o.totalOrderPrice}</td>
                  <td>{o.orderStatus}</td>
                  <td>
                    {!o.isPaid && (
                      <button onClick={() => handleAction(o._id, "paid")}>
                        Mark Paid
                      </button>
                    )}
                    {!o.isDelivered && (
                      <button onClick={() => handleAction(o._id, "delivered")}>
                        Mark Delivered
                      </button>
                    )}
                    {!o.isCanceled && (
                      <button
                        className="danger"
                        onClick={() => handleAction(o._id, "cancel")}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="danger"
                      onClick={() => handleAction(o._id, "delete")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={filters.page}
            setPage={(p) => setFilters({ ...filters, page: p })}
            totalResults={totalResults}
            limit={filters.limit}
          />
        </>
      )}
    </>
  );
}

/* ===================== Users Manager ===================== */
function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await getUsers(`?${params.toString()}`);
      setUsers(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <>
      <h2>Manage Users</h2>
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="danger"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={filters.page}
            setPage={(p) => setFilters({ ...filters, page: p })}
            totalResults={totalResults}
            limit={filters.limit}
          />
        </>
      )}
    </>
  );
}

export default Dashboard;






import React, { useState, useEffect } from "react";
import { getCategoryById, updateCategory } from "../services/categoryService";
import "./style/AdminForms.css"

export default function UpdateCategory({ categoryId, onSuccess }) {
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const data = await getCategoryById(categoryId);
      setForm({ name: data.name, price: data.price, description: data.description });
    };
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await updateCategory(categoryId, formData);
      alert("Category updated!");
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error updating category");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Category</h2>
      <input type="text" placeholder="Name" value={form.name} 
        onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="number" placeholder="Price" value={form.price} 
        onChange={(e) => setForm({ ...form, price: e.target.value })} required />
      <textarea placeholder="Description" value={form.description} 
        onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Category"}</button>
    </form>
  );
}




import React, { useState, useEffect } from "react";
import { getProductById, updateProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
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


import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";
import { createProduct } from "../services/productService";
import "./style/AdminForms.css"

export default function AddProduct({ onSuccess }) {
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
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageCover) formData.append("imageCover", imageCover);
    if (images.length) Array.from(images).forEach(img => formData.append("images", img));

    setLoading(true);
    try {
      await createProduct(formData);
      alert("Product created!");
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>
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
      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Product"}</button>
    </form>
  );
}


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCart, clearCart } from "../store/cartSlice";
import { getToken } from "../services/api";
import { createOrder } from "../services/orderService";
import "./style/CreateOrder.css";

function CreateOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  const { items, loading } = useSelector((state) => state.cart);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    detailedAddress: "",
    phone: "",
    city: "",
    postalCode: "",
  });

  const generateIdempotencyKey = () =>
    crypto.randomUUID?.() || Date.now().toString();

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
    else if (items.length === 0) dispatch(fetchCart());
  }, [dispatch, token, items.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    setError(null);
    if (
      !shippingAddress.detailedAddress ||
      !shippingAddress.phone ||
      !shippingAddress.city
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        detailedAddress: shippingAddress.detailedAddress,
        phone: shippingAddress.phone,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        shippingPrice: 0,
        paymentMethod: "cash",
        idempotencyKey: generateIdempotencyKey(),
      };

      await createOrder(orderData);
      dispatch(clearCart());
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Show popup then navigate home after 3s
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  // ---- RENDER ----
  if (loading) return <p className="loading">Loading order...</p>;

  return (
    <div className="make-order-page">
      <div className="make-order-container">
        <h2 className="make-order-title">Confirm Your Order</h2>

        <div className="order-items">
          {items.map((item) => (
            <div key={item.productId} className="order-item">
              <span>{item.code}</span>
              <span>
                {item.quantity} × {item.price} LE
              </span>
            </div>
          ))}
        </div>

        {error && <p className="order-error">{error}</p>}

        <form className="shipping-form">
          <h3 className="form-title">Shipping Address</h3>
          <div className="form-group">
            <label>Detailed Address</label>
            <textarea
              name="detailedAddress"
              value={shippingAddress.detailedAddress}
              onChange={handleChange}
              placeholder="Street, building, apartment..."
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="Cairo"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Postal Code (optional)</label>
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              placeholder="12345"
            />
          </div>
        </form>

        <div className="order-summary">
          <h3 className="order-total">Total: {totalPrice.toFixed(2)} LE</h3>
          <div className="order-actions">
            <button className="back-btn" onClick={() => navigate("/cart")}>
              Back to Cart
            </button>
            <button
              className="confirm-btn"
              onClick={handleConfirmOrder}
              disabled={submitting}
            >
              {submitting ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>

        {showPopup && (
          <div className="popup">
            <p>Order Created Successfully</p>
            <button
              className="popup-close"
              onClick={() => navigate("/")}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateOrder;
