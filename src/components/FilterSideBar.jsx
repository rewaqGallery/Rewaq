// import React, { useEffect, useState } from "react";
// import { getCategories } from "../services/categoryService";
// import "./style/filterSideBar.css";

// function FilterSidebar({ filters, onFilterChange }) {
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   //! Load categories from backend
//   const fetchCategories = async () => {
//     try {
//       let res = await getCategories();
//       setCategories(res.data || []);
//     } catch (err) {
//       console.error("Failed to load categories", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleCategoryChange = (e) => {
//     const value = e.target.value;

//     onFilterChange((prev) => ({
//       ...prev,
//       categories: value ? [value] : [],
//       page: 1,
//     }));
//   };

//   const handlePriceChange = (e) => {
//     onFilterChange((prev) => ({
//       ...prev,
//       maxPrice: Number(e.target.value),
//       page: 1,
//     }));
//   };

//   const handleAvailabilityChange = (e) => {
//     onFilterChange((prev) => ({
//       ...prev,
//       availableOnly: e.target.checked,
//       page: 1,
//     }));
//   };

//   const clearFilters = () => {
//     onFilterChange((prev) => ({
//       ...prev,
//       categories: [],
//       maxPrice: 0,
//       availableOnly: false,
//       keyword: "",
//       page: 1,
//     }));
//   };

//   return (
//     <div className="horizontal-filters">
//       <div className="filters-container">
//         {/* Category */}
//           <div className="filter-column">
//         <div className="filter-group-horizontal">
//           <h4>Category</h4>

//           <select
//             value={filters.categories[0] || ""}
//             onChange={handleCategoryChange}
//             disabled={loadingCategories}
//           >
//             <option value="">All</option>

//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>
// </div>

//         {/* Price */}
//   <div className="filter-column">
//         <div className="filter-group-horizontal">
//           <h4>Max Price</h4>

//           <input
//             type="range"
//             min="0"
//             max="300"
//             step="5"
//             value={filters.maxPrice || 0}
//             onChange={handlePriceChange}
//           />

//           <span>{filters.maxPrice || "Any"} LE</span>
//         </div>
// </div>

//         {/* Availability */}
//           <div className="filter-column available-clear" >
//         <div className="filter-group-horizontal">
//           <label>
//             <input
//               type="checkbox"
//               checked={filters.availableOnly}
//               onChange={handleAvailabilityChange}
//             />
//             Available Only
//           </label>
//         </div>

//         <button onClick={clearFilters}>Clear Filters</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FilterSidebar;

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
    onFilterChange((prev) => ({ ...prev, categories: value ? [value] : [], page: 1 }));
  };

  const handlePriceChange = (e) => {
    onFilterChange((prev) => ({ ...prev, maxPrice: Number(e.target.value), page: 1 }));
  };

  const handleAvailabilityChange = (e) => {
    onFilterChange((prev) => ({ ...prev, availableOnly: e.target.checked, page: 1 }));
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
    <div className="horizontal-filters">
      {/* Desktop Filters */}
      <div className="filters-container desktop-filters">
        <div className="filter-column">
          <div className="filter-group-horizontal">
            <h4>Category</h4>
            <select value={filters.categories[0] || ""} onChange={handleCategoryChange} disabled={loadingCategories}>
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-column">
          <div className="filter-group-horizontal">
            <h4>Max Price</h4>
            <input type="range" min="0" max="300" step="5" value={filters.maxPrice || 0} onChange={handlePriceChange} />
            <span>{filters.maxPrice || "Any"} LE</span>
          </div>
        </div>

        <div className="filter-column available-clear">
          <div className="filter-group-horizontal">
            <label>
              <input type="checkbox" checked={filters.availableOnly} onChange={handleAvailabilityChange} />
              Available Only
            </label>
          </div>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {/* Mobile Filters*/}
      <div className="mobile-filters">
        <details className="mobile-item">
          <summary>Category</summary>
          <select value={filters.categories[0] || ""} onChange={handleCategoryChange} disabled={loadingCategories}>
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </details>

        <details className="mobile-item">
          <summary>Price</summary>
          <div className="price-wrapper">
            <input type="range" min="0" max="300" step="5" value={filters.maxPrice || 0} onChange={handlePriceChange} />
            <span>{filters.maxPrice || "Any"} LE</span>
          </div>
        </details>

        <button
          className={`mobile-toggle ${filters.availableOnly ? "active" : ""}`}
          onClick={() => onFilterChange(prev => ({ ...prev, availableOnly: !prev.availableOnly, page: 1 }))}
        >
          Available
        </button>

        <button className="mobile-clear-btn" onClick={clearFilters}>Clear</button>
      </div>
    </div>
  );
}

export default FilterSidebar;
