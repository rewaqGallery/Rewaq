import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";
import {
  addFavouriteAsync,
  removeFavouriteAsync,
} from "../store/favouritesSlice";
import { getProductById } from "../services/productService";
import ErrorPage from "./ErrorPage";
import "./style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  //Redux
  const favouritesItems = useSelector((state) => state.favourites?.ids ?? []);
  const isFavourite =
    Array.isArray(favouritesItems) &&
    favouritesItems.some(
      (item) =>
        String(item ?? item._id ?? item.product?._id ?? item.productId) ===
        String(product?._id),
    );

  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const inCart =
    Array.isArray(cartItems) &&
    cartItems.some(
      (item) =>
        String(item.product?._id ?? item.productId) === String(product?._id),
    );

  const loadProduct = () => {
    setError(null);
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setMainImage(data?.imageCover?.url);
      })
      .catch((err) => setError(err.message || "Failed to fetch product"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const toggleFavourite = () => {
    if (!token) return alert("You must login");
    if (isFavourite) {
      dispatch(removeFavouriteAsync(product._id));
    } else {
      dispatch(addFavouriteAsync(product._id));
    }
  };

  const toggleCart = () => {
    if (!token) return alert("You must login");
    if (inCart) {
      dispatch(removeFromCartAsync(product._id));
    } else {
      dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
    }
  };

  if (loading)
    return <p className="product-details-loading">Loading product...</p>;

  if (error) {
    return (
      <ErrorPage
        code={500}
        title="Failed to load product"
        message={error}
        onRetry={loadProduct}
        showHome
      />
    );
  }

  if (!product) {
    return (
      <ErrorPage
        code={404}
        title="Product not found"
        message="The product you're looking for doesn't exist or has been removed."
        showHome
      />
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        {/* Images */}
        <div className="product-images">
          <div className="main-image-wrapper">
            <img
              src={mainImage}
              alt={product.description}
              className="main-image"
            />
          </div>

          <div className="gallery">
            {/* cover */}
            {product.imageCover?.url && (
              <img
                src={product.imageCover.url}
                alt="cover"
                className={mainImage === product.imageCover.url ? "active" : ""}
                onClick={() => setMainImage(product.imageCover.url)}
              />
            )}

            {/* images */}
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`product-${idx}`}
                className={mainImage === img.url ? "active" : ""}
                onClick={() => setMainImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          {/* <div className="tags">
            {product.tags?.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>{" "} */}

          <h2>{product.description}</h2>
          <p className="category">{product.category?.name}</p>
          <p className="category-desc">{product.category?.description}</p>
          <p className="price">{product.price} LE</p>
          <div className="product-actions">
            <button
              className={`fav-btn ${isFavourite ? "active" : ""}`}
              onClick={toggleFavourite}
            >
              {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
            </button>

            <button
              className={`cart-btn ${inCart ? "active" : ""}`}
              onClick={toggleCart}
              disabled={product.quantity <= 0}
            >
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
