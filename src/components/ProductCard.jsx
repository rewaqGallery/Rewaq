import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavouriteAsync,
  removeFavouriteAsync,
} from "../store/favouritesSlice";
import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";
import "./style/productCard.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items) || [];
  const cartItems = useSelector((state) => state.cart.items) || [];
  const token = localStorage.getItem("token");

  const productId = product?._id ?? product?.id;

  const isFavourite = favourites.some((f) => f._id === productId);

  const inCart = cartItems.some(
    (item) => String(item.product?._id ?? item.productId) === String(productId),
  );

  const handleFavourite = () => {
    if (!token) {
      alert("You must login first");
      return;
    }
    if (isFavourite) {
      dispatch(removeFavouriteAsync(productId));
    } else {
      dispatch(addFavouriteAsync(productId));
    }
  };

  const handleCart = () => {
    if (!token) {
      alert("You must login first");
      return;
    }
    if (inCart) {
      dispatch(removeFromCartAsync(productId));
    } else {
      dispatch(addToCartAsync({ productId, quantity: 1 }));
    }
  };

  return (
    <div className="product-card">
      <button
        className={`favorite-btn ${isFavourite ? "active" : ""}`}
        onClick={handleFavourite}
      >
        {isFavourite ? <FaHeart /> : <FaRegHeart />}
      </button>

      <Link to={`/product/${productId}`} className="product-link">
        <div className="product-image-wrapper">
          {product.quantity <= 0 && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}

          <img
            src={product.imageCover?.url}
            alt={product.code}
            className="product-image"
            loading="lazy"
          />
        </div>

        <div className="product-info">
          <span className="product-category">{product.category?.name}</span>
          <h3 className="product-name">{product.description}</h3>
          <div className="product-price">{product.price.toFixed(2)} LE</div>
        </div>
      </Link>

      <div className="product-actions">
        <button
          type="button"
          className={`product-btn add-to-cart ${inCart ? "in-cart" : ""}`}
          onClick={handleCart}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
