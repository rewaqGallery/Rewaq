import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  deleteCategory,
} from "../../../services/categoryService";
import CategoriesTable from "./CategoriesTable";
import Pagination from "../Pagination";
import "./categoryManger.css"
export default function CategoriesManager() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    sort: "-createdAt",
    page: 1,
    limit: 5,
  });

  //! Fetch
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(filters);
      const res = await getCategories(`?${params.toString()}`);

      setCategories(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  //! Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Categories</h2>
        <button onClick={() => navigate("/dashboard/categories/create")}>
          + Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="filter-sort">
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
          <CategoriesTable
            categories={categories}
            onEdit={(cat) =>
              navigate(`/dashboard/categories/update/${cat._id}`)
            }
            onDelete={handleDelete}
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
