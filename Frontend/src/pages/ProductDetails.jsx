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
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import "./style/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState({
    id: null,
    type: null,
  });

  const token = localStorage.getItem("token");
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

  const toggleFavourite = async () => {
    if (!token) {
      setAlert({ type: "error", text: "You must login" });
      return;
    }

    setLoadingBtn({ id: product._id, type: "favourite" });

    try {
      if (isFavourite) {
        await dispatch(removeFavouriteAsync(product._id)).unwrap();
        setAlert({ type: "success", text: "Removed from favourites" });
      } else {
        await dispatch(addFavouriteAsync(product._id)).unwrap();
        setAlert({ type: "success", text: "Added to favourites" });
      }
    } catch (err) {
      setAlert({
        type: "error",
        text: err.message || "Failed to update favourites",
      });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

  const toggleCart = async () => {
    if (!token) {
      setAlert({ type: "error", text: "You must login" });
      return;
    }

    setLoadingBtn({ id: product._id, type: "cart" });
    try {
      if (inCart) {
        await dispatch(removeFromCartAsync(product._id)).unwrap();
        setAlert({ type: "success", text: "Removed from cart" });
      } else {
        await dispatch(
          addToCartAsync({ productId: product._id, quantity: 1 }),
        ).unwrap();
        setAlert({ type: "success", text: "Added to cart" });
      }
    } catch (err) {
      setAlert({
        type: "error",
        text: err.message || "Failed to update cart",
      });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

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
  const favLoading =
    loadingBtn.id === product?._id && loadingBtn.type === "favourite";

  const cartLoading =
    loadingBtn.id === product?._id && loadingBtn.type === "cart";

  return (
    <>
      {alert && <Alert message={alert} />}
      <main className="product-details-page">
        <section className="product-details-container">
          <section className="product-images" aria-label="Product images">
            <div className="main-image-wrapper">
              <img
                src={mainImage}
                alt={product.description || "Product image"}
                className="main-image"
                loading="lazy"
              />
            </div>

            <div className="gallery">
              {product.imageCover?.url && (
                <img
                  src={product.imageCover.url}
                  alt="product cover"
                  role="listitem"
                  className={
                    mainImage === product.imageCover.url ? "active" : ""
                  }
                  onClick={() => setMainImage(product.imageCover.url)}
                />
              )}

              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`product-${idx}`}
                  role="listitem"
                  className={mainImage === img.url ? "active" : ""}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          </section>

          <article className="product-info">
            {/* <div className="tags">
            {product.tags?.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>{" "} */}
            <header className="product-header">
              <h1>{product.description}</h1>
              <div className="row">
                <p className="category">{product.category?.name}</p>

                <div className="prices">
                  {isNaN(product.priceAfterDiscount) ? (
                    <p
                      className="product-priceAfterDiscount"
                      aria-label={`Price after discount: ${product.priceAfterDiscount} Egyptian pounds`}
                    >
                      {Number(product.price).toFixed(2)} LE
                    </p>
                  ) : (
                    <>
                      <p
                        className="product-price"
                        aria-label={`Original price: ${product.price} Egyptian pounds`}
                      >
                        {product.price} LE
                      </p>
                      <p
                        className="product-priceAfterDiscount"
                        aria-label={`Price after discount: ${product.priceAfterDiscount} Egyptian pounds`}
                      >
                        {product.priceAfterDiscount} LE
                      </p>
                    </>
                  )}
                </div>
              </div>

              <p className="category-desc">{product.category?.description}</p>
            </header>

            <div className="product-actions">
              <button
                className={`fav-btn ${isFavourite ? "active" : ""}`}
                onClick={toggleFavourite}
                disabled={favLoading}
              >
                {favLoading ? (
                  <Loading text="" />
                ) : isFavourite ? (
                  "Remove from Favourites"
                ) : (
                  "Add to Favourites"
                )}
              </button>
              <button
                className={`cart-btn ${inCart ? "active" : ""}`}
                onClick={toggleCart}
                disabled={cartLoading}
              >
                {cartLoading ? (
                  <Loading text="" />
                ) : inCart ? (
                  "Remove from Cart"
                ) : (
                  "Add to Cart"
                )}
              </button>{" "}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default ProductDetails;
