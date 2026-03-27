import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../../services/productService";
import ProductsTable from "./ProductsTable";
import Pagination from "../../../components/Pagination";

export default function ProductsManager() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    sort: "-createdAt",
    page: 1,
    limit: 25,
    keyword: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts(filters);
      setProducts(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // const handlePageChange = (newPage) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     page: newPage,
  //   }));
  // };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const toggleFeatures = async (id) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    const newValue = !product.featured;

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, featured: newValue } : p)),
    );

    try {
      const formData = new FormData();
      formData.append("featured", newValue);

      await updateProduct(id, formData);
    } catch (error) {
      // rollback if failed
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, featured: product.featured } : p,
        ),
      );
      setError("Failed to toggle featured");
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;

    const oldQuantity = product.quantity;

    // optimistic update
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, quantity: newQuantity } : p)),
    );

    try {
      const formData = new FormData();
      formData.append("quantity", newQuantity);
      await updateProduct(id, formData);
    } catch (error) {
      // rollback if failed
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, quantity: oldQuantity } : p)),
      );
      setError("Failed to update quantity");
    }
  };
  return (
    <section className="manager">
      <div className="manager-header">
        <h2>Manage Products</h2>
        <button
          onClick={() => navigate("/dashboard/products/create")}
          aria-label="Add new product"
        >
          + Add Product
        </button>
      </div>

      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
          aria-label="search by name"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          aria-label="sort products"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
          <option value="price">Price LOW to HIGH</option>
          <option value="-price">Price HIGH to LOW</option>
        </select>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status" aria-live="polite">
          Loading...
        </p>
      ) : (
        <>
          {products.length === 0 ? (
            <p>No Products found</p>
          ) : (
            <ProductsTable
              products={products}
              onEdit={(p) => navigate(`/dashboard/products/update/${p._id}`)}
              onDelete={handleDelete}
              toggleFeatures={toggleFeatures}
              updateQuantity={updateQuantity}
            />
          )}

          <Pagination
            page={filters.page}
            limit={filters.limit}
            totalResults={totalResults}
            setPage={(p) => setFilters({ ...filters, page: p })}
          />
        </>
      )}
    </section>
  );
}
