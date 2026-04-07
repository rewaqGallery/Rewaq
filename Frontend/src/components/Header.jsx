import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearCart } from "../store/cartSlice";
import { clearFavourites } from "../store/favouritesSlice";
import LoginRegister from "../pages/LoginRegister";

import Logo from "../img/logorewaq.png";
import { IoCart, IoSearch, IoSunny } from "react-icons/io5";
import { MdModeNight } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { HiMenu } from "react-icons/hi";

import "./style/header.css";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const token = localStorage.getItem("token");

  const getUserFromToken = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };

  const user = getUserFromToken();

  const favouritesCount = useSelector(
    (state) => state.favourites?.ids?.length ?? 0,
  );

  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(clearFavourites());
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/product?keyword=${searchTerm}`);
    setSearchTerm("");
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      document.body.classList.toggle("dark-mode", nextMode);
      return nextMode;
    });
  };

  React.useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="Header">
      <div className="container">
        <Link to="/" className="logo-link" aria-label="Go to homepage">
          <img src={Logo} alt="Rewaq store logo" className="logo" />
        </Link>

        <form
          className="search_box"
          role="search"
          onSubmit={handleSearch}
          aria-label="Product search"
        >
          <input
            type="text"
            placeholder="Search"
            aria-label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <IoSearch />
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={showMobileMenu}
          aria-controls="mobile-navigation"
          type="button"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          <HiMenu />
        </button>

        {/* Icons / Mobile Dropdown */}
        <nav
          id="mobile-navigation"
          className={`header_icons mobile ${showMobileMenu ? "active" : ""}`}
        >
          <Link
            to="/favourites"
            className="icon"
            aria-label="Favourites"
            onClick={() => setShowMobileMenu(false)}
          >
            <FaRegHeart />
            <span className="count">{token ? favouritesCount : 0}</span>
          </Link>

          <Link
            to="/cart"
            className="icon"
            aria-label="Cart"
            onClick={() => setShowMobileMenu(false)}
          >
            <IoCart />
            <span className="count">{token ? cartCount : 0}</span>
          </Link>

          <Link
            to="/profile"
            className="icon"
            aria-label="Profile"
            onClick={() => setShowMobileMenu(false)}
          >
            <CgProfile />
          </Link>

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to night mode"
            }
            title={isDarkMode ? "Light mode" : "Night mode"}
          >
            {isDarkMode ? <IoSunny /> : <MdModeNight />}
          </button>

          {user?.role === "admin" && (
            <Link
              to="/dashboard"
              className="nav-btn"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
          )}

          {!token ? (
            <button
              className="nav-btn login-btn"
              onClick={() => {
                setShowAuth(true);
                setShowMobileMenu(false);
              }}
            >
              Login
            </button>
          ) : (
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>

      {showAuth && <LoginRegister onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Header;
