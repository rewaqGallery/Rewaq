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
          aria-label={inCart ? "Remove from cart" : "Add to cart"}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
