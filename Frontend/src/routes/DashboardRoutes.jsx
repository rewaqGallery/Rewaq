import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const CategoryForm = lazy(() =>
  import("../pages/dashboard/category/CategoryForm")
);
const CategoriesManager = lazy(() =>
  import("../pages/dashboard/category/CategoriesManager")
);
const ProductForm = lazy(() =>
  import("../pages/dashboard/product/ProductForm")
);
const ProductsManager = lazy(() =>
  import("../pages/dashboard/product/ProductsManager")
);

export default function DashboardRoutes() {
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