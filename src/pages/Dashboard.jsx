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
