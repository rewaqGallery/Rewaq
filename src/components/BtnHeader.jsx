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
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="categories-nav">
      {loading && <span>Loading...</span>}
      {error && <span>{error}</span>}

      <div className="container">
        <ul className="categories-list">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/product?category=${cat._id}`}
                className="category-link"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
