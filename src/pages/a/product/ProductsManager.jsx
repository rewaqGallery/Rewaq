import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./../../../services/productService";
import ProductsTable from "./ProductsTable";
import Pagination from "../Pagination";
// import "./categoryManger.css"

export default function ProductsManager() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: "-createdAt",
    page: 1,
    limit: 5,
    keyword: "",
  });
  
  //! Fetch
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const res = await getProducts(`?${params.toString()}`);

      setProducts(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  //! Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteProduct(id);
    fetchProducts();
  };
  //!
  const toggleFeatures = async (id) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, featured: !p.featured } : p)),
      );
      const product = products.find((p) => p._id === id);

      await updateProduct(id, {
        featured: !product.featured,
      });
    } catch (error) {
      setError("Failed to toggle featured:", error);
    }
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Products</h2>
        <button onClick={() => navigate("/dashboard/products/create")}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by name..."
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
          <option value="price">Price LOW to HIGH</option>
          <option value="-price">Price HIGH to LOW</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductsTable
            products={products}
            onEdit={(p) => navigate(`/dashboard/products/update/${p._id}`)}
            onDelete={handleDelete}
            toggleFeatures={toggleFeatures}
          />

          <Pagination
            page={filters.page}
            limit={filters.limit}
            totalResults={totalResults}
            setPage={(p) => setFilters({ ...filters, page: p })}
          />
        </>
      )}
    </div>
  );
}
