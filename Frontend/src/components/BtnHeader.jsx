import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import "./style/BtnHeader.css";

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getCategories({ sort: "createdAt" });
        setCategories(res.data || []);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="categories-nav" aria-label="Product Categories">
      <div className="container">
        {loading && (
          <span className="nav-status" aria-live="polite">
            Loading...
          </span>
        )}
        {error && (
          <span className="nav-error" role="alert">
            {error}
          </span>
        )}
        {!loading && !error && categories.length > 0 && (
          <ul className="categories-list">
            {categories.map((cat) => (
              <li key={cat._id} className="category-item">
                <Link
                  to={`/product?category=${cat._id}`}
                  className="category-link"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
