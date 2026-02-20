// Dashboard/Dashboard.jsx
import React, { useState } from "react";
import ProductsManager from "./product/ProductsManager";
import CategoriesManager from "./category/CategoriesManager";
import OrdersManager from "./OrdersManager";
import UsersManager from "./UsersManager";
import "./style/Dashboard.css";

export default function Dashboard() {
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
