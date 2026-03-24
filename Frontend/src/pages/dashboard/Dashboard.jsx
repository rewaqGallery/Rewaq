import React, { useState } from "react";
import ProductsManager from "./product/ProductsManager";
import CategoriesManager from "./category/CategoriesManager";
import OrdersManager from "./OrdersManager";
import UsersManager from "./UsersManager";
import "./Style/Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = {
    products: <ProductsManager />,
    categories: <CategoriesManager />,
    orders: <OrdersManager />,
    users: <UsersManager />,
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h1>Admin Panel</h1>
        <nav>
          <ul>
            <li>
              <button
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
            </li>
            <li>
              <button
                className={activeTab === "categories" ? "active" : ""}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </button>
            </li>
            <li>
              <button
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
            </li>
            <li>
              <button
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">{tabs[activeTab]}</main>
    </div>
  );
}