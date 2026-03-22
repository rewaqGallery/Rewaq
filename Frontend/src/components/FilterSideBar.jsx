import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import "./style/filterSideBar.css";

function FilterSidebar({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    onFilterChange((prev) => ({
      ...prev,
      categories: value ? [value] : [],
      page: 1,
    }));
  };

  const handlePriceChange = (e) => {
    onFilterChange((prev) => ({
      ...prev,
      maxPrice: Number(e.target.value),
      page: 1,
    }));
  };

  const handleAvailabilityChange = (e) => {
    onFilterChange((prev) => ({
      ...prev,
      availableOnly: e.target.checked,
      page: 1,
    }));
  };

  const clearFilters = () => {
    onFilterChange((prev) => ({
      ...prev,
      categories: [],
      maxPrice: 0,
      availableOnly: false,
      keyword: "",
      page: 1,
    }));
  };

  return (
    <section className="horizontal-filters" aria-label="Product Filters">
      {/* Desktop Filters */}
      <div className="filters-container desktop-filters">
        <div className="filter-column">
          <label className="filter-group-vertical">
            <span className="filter-title">Category</span>
            <select
              value={filters.categories[0] || ""}
              onChange={handleCategoryChange}
              disabled={loadingCategories}
              aria-label="Filter by category"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filter-column">
          <div className="filter-group-vertical">
            <span className="filter-title">Max Price</span>
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={filters.maxPrice || 0}
              onChange={handlePriceChange}
              aria-label="Maximum price"
            />
            <output>{filters.maxPrice || "Any"} LE</output>{" "}
          </div>
        </div>

        <div className="filter-column available-clear">
          <label className="filter-group-vertical">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={handleAvailabilityChange}
              aria-label="Show available products only"
            />
            <output> Available Only</output>
          </label>
          <button onClick={clearFilters} aria-label="Clear all filters">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Mobile Filters*/}
      <div className="mobile-filters">
        <details className="mobile-item">
          <summary>Category</summary>
          <select
            value={filters.categories[0] || ""}
            onChange={handleCategoryChange}
            disabled={loadingCategories}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </details>

        <details className="mobile-item">
          <summary>Price</summary>
          <div className="price-wrapper">
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={filters.maxPrice || 0}
              onChange={handlePriceChange}
            />
            <span>{filters.maxPrice || "Any"} LE</span>
          </div>
        </details>

        <button
          className={`mobile-toggle ${filters.availableOnly ? "active" : ""}`}
          onClick={() =>
            onFilterChange((prev) => ({
              ...prev,
              availableOnly: !prev.availableOnly,
              page: 1,
            }))
          }
        >
          Available
        </button>

        <button className="mobile-clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </section>
  );
}

export default FilterSidebar;
