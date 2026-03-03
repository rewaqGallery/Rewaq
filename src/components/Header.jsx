import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearCart } from "../store/cartSlice";
import { clearFavourites } from "../store/favouritesSlice";
import LoginRegister from "../pages/LoginRegister";

import Logo from "../img/logorewaq.png";
import { IoCart, IoSearch } from "react-icons/io5";
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

  return (
    <div className="Header">
      <div className="container">
        <Link to="/" className="logo-link">
          <img src={Logo} alt="logo" className="logo" />
        </Link>

        <form className="search_box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <IoSearch />
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          <HiMenu />
        </button>

        {/* Icons / Mobile Dropdown */}
        <div
          className={`header_icons mobile ${showMobileMenu ? "active" : ""}`}
        >
          <Link
            to="/favourites"
            className="icon"
            onClick={() => setShowMobileMenu(false)}
          >
            <FaRegHeart />
            <span className="count">{token ? favouritesCount : 0}</span>
          </Link>

          <Link
            to="/cart"
            className="icon"
            onClick={() => setShowMobileMenu(false)}
          >
            <IoCart />
            <span className="count">{token ? cartCount : 0}</span>
          </Link>

          <Link
            to="/profile"
            className="icon"
            onClick={() => setShowMobileMenu(false)}
          >
            <CgProfile />
          </Link>

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
        </div>
      </div>

      {showAuth && <LoginRegister onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Header;
