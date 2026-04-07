import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavouriteAsync,
  removeFavouriteAsync,
} from "../store/favouritesSlice";
import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";

import Alert from "./Alert";
import Loading from "./Loading";

import "./style/productCard.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  const favourites = useSelector((state) => state.favourites.ids) || [];
  const cartItems = useSelector((state) => state.cart.items) || [];
  const token = localStorage.getItem("token");

  const productId = product?._id ?? product?.id;
  const productName = product?.description || "Product";

  const isFavourite = favourites.some((f) => f === productId);

  const inCart = cartItems.some(
    (item) => String(item.product?._id ?? item.productId) === String(productId),
  );

  const handleFavourite = () => {
    if (!token) {
      setMessage({ type: "error", text: "You must login first" });
      return;
    }

    if (isFavourite) {
      dispatch(removeFavouriteAsync(productId));
      setMessage({ type: "success", text: "Removed from favourites" });
    } else {
      dispatch(addFavouriteAsync(productId));
      setMessage({ type: "success", text: "Added to favourites" });
    }
  };
  const handleCart = async () => {
    if (!token) {
      setMessage({ type: "error", text: "You must login first" });
      return;
    }

    try {
      setLoadingCart(true);

      if (inCart) {
        await dispatch(removeFromCartAsync(productId)).unwrap();
        setMessage({ type: "success", text: "Removed from cart" });
      } else {
        await dispatch(addToCartAsync({ productId, quantity: 1 })).unwrap();
        setMessage({ type: "success", text: "Added to cart" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoadingCart(false);
    }
  };
  return (
    <>
      <Alert message={message} />
      <article className="product-card">
        <button
          className={`favorite-btn ${isFavourite ? "active" : ""}`}
          onClick={handleFavourite}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
          aria-pressed={isFavourite}
        >
          {isFavourite ? <FaHeart /> : <FaRegHeart />}
        </button>

        <Link
          to={`/product/${productId}`}
          className="product-link"
          aria-label={`View details for ${productName}`}
        >
          <div className="product-image-wrapper">
            {product.quantity <= 0 && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}

            <img
              src={product.imageCover?.url}
              alt={product.description}
              className="product-image"
              loading="lazy"
            />
          </div>

          <div className="product-info">
            <span className="product-category">{product.category?.name}</span>
            <div className="product-name">{product.description}</div>
            <div className="product-prices">
              {isNaN(product.priceAfterDiscount) ? (
                <span className="product-priceAfterDiscount">
                  {Number(product.price).toFixed(2)} LE
                </span>
              ) : (
                <>
                  <span className="product-priceAfterDiscount">
                    {Number(product.priceAfterDiscount).toFixed(2)} LE
                  </span>
                  <span className="product-price">
                    {Number(product.price).toFixed(2)} LE
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        <div className="product-actions">
          <button
            type="button"
            className={`product-btn add-to-cart ${inCart ? "in-cart" : ""}`}
            onClick={handleCart}
            disabled={loadingCart}
            aria-label={inCart ? "Remove from cart" : "Add to cart"}
          >
            {loadingCart ? (
              <Loading text="" />
            ) : inCart ? (
              "In Cart"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </article>
    </>
  );
}

export default ProductCard;
