import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  deleteCategory,
} from "../../../services/categoryService";
import CategoriesTable from "./CategoriesTable";
import Pagination from "../../../components/Pagination";
import "../Style/Managers.css";

export default function CategoriesManager() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    sort: "-createdAt",
    page: 1,
    limit: 10,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories(filters);
      setCategories(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <section className="manager">
      <div className="manager-header">
        <h2>Manage Categories</h2>
        <button
          onClick={() => navigate("/dashboard/categories/create")}
          aria-label="Add new category"
        >
          + Add Category
        </button>
      </div>

      <div className="filter-sort">
        <select
          value={filters.sort}
          className="category-select"
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          aria-label="sort categories"
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
          {categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            <CategoriesTable
              categories={categories}
              onEdit={(cat) =>
                navigate(`/dashboard/categories/update/${cat._id}`)
              }
              onDelete={handleDelete}
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
