import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductPage"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Favourites = lazy(() => import("../pages/Favourites"));
const CreateOrder = lazy(() => import("../pages/CreateOrder"));
const MyProfile = lazy(() => import("../pages/ProfilePage"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const GoogleSuccess = lazy(() => import("../pages/GoogleSuccess"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/create-order" element={<CreateOrder />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/order/:id" element={<OrderDetailsPage />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
    </Routes>
  );
}