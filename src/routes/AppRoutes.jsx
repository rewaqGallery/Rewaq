import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./PrivateRoute";

const Home = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductPage"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Favourites = lazy(() => import("../pages/Favourites"));
const Cart = lazy(() => import("../pages/Cart"));
const CreateOrder = lazy(() => import("../pages/CreateOrder"));
const MyProfile = lazy(() => import("../pages/ProfilePage"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const GoogleSuccess = lazy(() => import("../pages/GoogleSuccess"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const CategoryForm = lazy(() => import("../pages/dashboard/category/CategoryForm"));
const CategoriesManager = lazy(() => import("../pages/dashboard/category/CategoriesManager"));
const ProductForm = lazy(() => import("../pages/dashboard/product/ProductForm"));
const ProductsManager = lazy(() => import("../pages/dashboard/product/ProductsManager"));

function RouteFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
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
