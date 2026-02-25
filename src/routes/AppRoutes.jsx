import { Routes, Route } from "react-router-dom";
import AdminRoute from "./PrivateRoute";

import Home from "../pages/HomePage";
import ProductsPage from "../pages/ProductPage";
import ProductDetails from "../pages/ProductDetails";
import Favourites from "../pages/Favourites";
import Cart from "../pages/Cart";
import CreateOrder from "../pages/CreateOrder";
import MyProfile from "../pages/ProfilePage";
import MyOrders from "../pages/MyOrders";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import GoogleSuccess from "../pages/GoogleSuccess";
import ErrorPage from "../pages/ErrorPage";
import Dashboard from "../pages/a/Dashboard";

import UpdateCategory from "../pages/a/UpdateCategory";

import CategoryForm from "../pages/a/category/CategoryForm";
import CategoriesManager from "../pages/a/category/CategoriesManager";
import ProductForm from "../pages/a/product/ProductForm";
import ProductsManager from "../pages/a/product/ProductsManager";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/create-order" element={<CreateOrder />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route path="/category/:id" element={<UpdateCategory />} />
      <Route path="/order/:id" element={<OrderDetailsPage />} />

      {/* Admin Routes */}
      <Route
        path="/dashboard/*"
        element={
          <AdminRoute>
            <DashboardRoutes />
          </AdminRoute>
        }
      />

      <Route path="*" element={<ErrorPage code={404} />} />
    </Routes>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />

      <Route path="categories" element={<CategoriesManager />} />
      <Route path="categories/create" element={<CategoryForm />} />
      <Route path="categories/update/:id" element={<CategoryForm />} />

      <Route path="products" element={<ProductsManager />} />
      <Route path="products/create" element={<ProductForm />} />
      <Route path="products/update/:id" element={<ProductForm />} />
    </Routes>
  );
}
