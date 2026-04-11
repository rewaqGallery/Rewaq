import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addFavouriteAsync,
  removeFavouriteAsync,
} from "../store/favouritesSlice";
import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";
import { updateProduct } from "../services/productService";

import Alert from "./Alert";
import Loading from "./Loading";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { AiOutlineCheckCircle } from "react-icons/ai";

import "./style/productCard.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFeature, setLoadingFeature] = useState(false);
  const [isFeatured, setIsFeatured] = useState(product.featured);

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  } catch (e) {
    user = null;
  }
  const isAdmin = user?.role === "admin";

  const favourites = useSelector((state) => state.favourites.ids) || [];
  const cartItems = useSelector((state) => state.cart.items) || [];

  const productId = product?._id ?? product?.id;
  const productName = product?.description || "Product";

  useEffect(() => {
    setIsFeatured(product.featured);
  }, [product.featured]);

  const isFavourite = favourites.some((f) => f === productId);
  const inCart = cartItems.some(
    (item) => String(item.product?._id ?? item.productId) === String(productId),
  );

  const handleToggleFeature = async () => {
    const newValue = !isFeatured;
    setIsFeatured(newValue);
    setLoadingFeature(true);
    try {
      const formData = new FormData();
      formData.append("featured", newValue);

      await updateProduct(productId, formData);

      setMessage({ type: "success", text: "Feature updated" });
    } catch {
      setIsFeatured(!newValue);
      setMessage({ type: "error", text: "Failed to update feature" });
    } finally {
      setLoadingFeature(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/products/update/${productId}`);
  };

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

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      <Alert message={message} />
      <article className="product-card">
        <button
          className={`favorite-btn ${
            isAdmin ? (isFeatured ? "active" : "") : isFavourite ? "active" : ""
          }`}
          onClick={isAdmin ? handleToggleFeature : handleFavourite}
          disabled={isAdmin ? loadingFeature : false}
          aria-label={
            isAdmin
              ? isFeatured
                ? "Remove from featured"
                : "Add to featured"
              : isFavourite
                ? "Remove from favourites"
                : "Add to favourites"
          }
        >
          {isAdmin ? (
            isFeatured ? (
              <AiOutlineCheckCircle />
            ) : (
              <AiOutlineCheckCircle />
            )
          ) : isFavourite ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </button>
        <Link
          to={`/product/${productId}`}
          className="product-link"
          aria-label={`View details for ${productName}`}
        >
          <div className="product-image-wrapper">
            {product?.quantity <= 0 && (
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
            className={`product-btn ${
              isAdmin ? "edit-product" : "add-to-cart"
            } ${inCart ? "in-cart" : ""}`}
            onClick={isAdmin ? handleEdit : handleCart}
            disabled={loadingCart && !isAdmin}
          >
            {isAdmin ? (
              "Edit Product"
            ) : loadingCart ? (
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
