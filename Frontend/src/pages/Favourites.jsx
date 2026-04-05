import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchFavourites,
  fetchFavouriteProducts,
  removeFavouriteAsync,
  clearFavouritesError,
} from "../store/favouritesSlice";

import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";

import ErrorDisplay from "../components/ErrorDisplay";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

import "./style/Favourites.css";

function Favourites() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { products, loading, productsLoading, error } = useSelector(
    (state) => state.favourites,
  );
  const cartItems = useSelector((state) => state.cart.items);

  const [alert, setAlert] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState({
    id: null,
    type: null,
  });

  useEffect(() => {
    if (!token) return;

    dispatch(fetchFavourites());
    dispatch(fetchFavouriteProducts());
  }, [token, dispatch]);

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  const cartIds = new Set(
    cartItems.map((c) => String(c.product?._id ?? c.productId)),
  );
  const isInCart = (id) => cartIds.has(String(id));

  const handleToggleCart = async (product) => {
    if (!token) {
      setAlert({ type: "warning", text: "You must login first" });
      return;
    }

    setLoadingBtn({ id: product._id, type: "cart" });

    try {
      if (isInCart(product._id)) {
        await dispatch(removeFromCartAsync(product._id)).unwrap();
        setAlert({ type: "success", text: "Removed from cart" });
      } else {
        await dispatch(
          addToCartAsync({
            productId: product._id,
            quantity: 1,
          }),
        ).unwrap();
        setAlert({ type: "success", text: "Added to cart" });
      }
    } catch {
      setAlert({ type: "error", text: "Something went wrong" });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

  const handleRemoveFavourite = async (productId) => {
    setLoadingBtn({ id: productId, type: "remove" });

    try {
      await dispatch(removeFavouriteAsync(productId)).unwrap();
      setAlert({ type: "success", text: "Removed from favourites" });
    } catch {
      setAlert({ type: "error", text: "Failed to remove item" });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

  if (loading || productsLoading) {
    return <Loading text="Loading favourites..." />;
  }

  return (
    <section className="favourites-page">
      <div className="favourites-container">
        <h2 className="favourites-title">Your Favourites</h2>

        <Alert message={alert} />

        <ErrorDisplay
          message={error}
          onRetry={() => dispatch(fetchFavouriteProducts())}
          onDismiss={() => dispatch(clearFavouritesError())}
        />

        {products.length === 0 ? (
          <p className="empty-favourites" role="status">
            No favourites yet.
          </p>
        ) : (
          <ul className="favourites-items">
            {products.map((item) => {
              const inCart = isInCart(item._id);

              const isCartLoading =
                loadingBtn.id === item._id && loadingBtn.type === "cart";

              const isRemoveLoading =
                loadingBtn.id === item._id && loadingBtn.type === "remove";

              return (
                <li key={item._id} className="favourite-item">
                  <div className="favourite-image">
                    <img
                      src={item.imageCover?.url ?? item.image}
                      alt={item.description || "Product image"}
                      loading="lazy"
                    />
                  </div>

                  <div className="favourite-details">
                    <h3 className="product-title">{item.description}</h3>

                    <p className="favourite-price">
                      {isNaN(item.priceAfterDiscount)
                        ? Number(item.price).toFixed(2)
                        : Number(item.priceAfterDiscount).toFixed(2)}
                    </p>

                    <div className="favourite-actions">
                      <Link to={`/product/${item._id}`} className="view-btn">
                        View
                      </Link>

                      <button
                        className="cart-btn"
                        onClick={() => handleToggleCart(item)}
                        type="button"
                        disabled={isCartLoading}
                      >
                        {isCartLoading
                          ? "Loading..."
                          : inCart
                            ? "Remove from Cart"
                            : "Add to Cart"}
                      </button>

                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFavourite(item._id);
                        }}
                        disabled={isRemoveLoading}
                        type="button"
                      >
                        {isRemoveLoading ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Favourites;
