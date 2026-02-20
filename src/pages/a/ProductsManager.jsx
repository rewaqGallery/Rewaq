import React, { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../../services/productService";
import Pagination from "./Pagination";
import AddProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({ keyword: "", page: 1, limit: 5, sort: "-createdAt" });

  // For showing forms
  const [showAddForm, setShowAddForm] = useState(false);
  const [updateProductId, setUpdateProductId] = useState(null);

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
    <div>
      <h2>Manage Products</h2>

      {/* Buttons to show forms */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setShowAddForm(true)}>+ Create Product</button>
      </div>

      {/* Show AddProduct form */}
      {showAddForm && (
        <AddProduct
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts();
          }}
        />
      )}

      {/* Show UpdateProduct form */}
      {updateProductId && (
        <UpdateProduct
          productId={updateProductId}
          onSuccess={() => {
            setUpdateProductId(null);
            fetchProducts();
          }}
        />
      )}

      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 1 })}
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

      {loading ? <p>Loading...</p> : (
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
                    <button onClick={() => setUpdateProductId(p._id)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(p._id)}>Delete</button>
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
    </div>
  );
}
