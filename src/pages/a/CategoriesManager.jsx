import React, { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "../../services/categoryService";
import Pagination from "./Pagination";
import AddCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const res = await getCategories(`?${params.toString()}`);
      setCategories(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>

      {error && <div className="error-box">{error}</div>}

      <button onClick={() => setShowAddForm(true)}>+ Create Category</button>

      {showAddForm && (
        <AddCategory
          onSuccess={() => {
            setShowAddForm(false);
            fetchCategories();
          }}
        />
      )}

      {updateCategoryId && (
        <UpdateCategory
          categoryId={updateCategoryId}
          onSuccess={() => {
            setUpdateCategoryId(null);
            fetchCategories();
          }}
        />
      )}

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
                    <button onClick={() => setUpdateCategoryId(c._id)}>
                      Edit
                    </button>
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
