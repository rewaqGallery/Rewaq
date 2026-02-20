import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchFavourites,
  removeFavouriteAsync,
  clearFavouritesError,
} from "../store/favouritesSlice";

import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";

import ErrorDisplay from "../components/ErrorDisplay";

import "./style/Favourites.css";

function Favourites() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const {
    items: favourites,
    loading,
    error,
  } = useSelector((state) => state.favourites);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (token) dispatch(fetchFavourites());
  }, [dispatch, token]);

  const isInCart = (productId) =>
    cartItems.some((c) => c.productId === productId);

  const handleToggleCart = (item) => {
    if (!token) {
      alert("You must login");
      return;
    }

    if (isInCart(item._id)) {
      dispatch(removeFromCartAsync(item._id));
    } else {
      dispatch(
        addToCartAsync({
          productId: item._id,
          quantity: 1,
        }),
      );
    }
  };

  if (loading) {
    return <p className="loading">Loading favourites...</p>;
  }

  return (
    <div className="favourites-page">
      <div className="favourites-container">
        <h2 className="favourites-title">Your Favourites</h2>

        <ErrorDisplay
          message={error}
          onRetry={() => dispatch(fetchFavourites())}
          onDismiss={() => dispatch(clearFavouritesError())}
        />

        {favourites.length === 0 ? (
          <p className="empty-favourites">No favourites yet.</p>
        ) : (
          <div className="favourites-items">
            {favourites.map((item, index) => (
              <div key={item._id ?? `fav-${index}`} className="favourite-item">
                <div className="favourite-image">
                  <img src={item.image} alt={item.code} />
                </div>

                <div className="favourite-details">
                  <h3>{item.code}</h3>

                  <p className="favourite-price">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <div className="favourite-actions">
                    <Link to={`/product/${item._id}`} className="view-btn">
                      View
                    </Link>

                    <button
                      className="remove-btn"
                      onClick={() => dispatch(removeFavouriteAsync(item._id))}
                    >
                      Remove
                    </button>

                    <button
                      className="cart-btn"
                      onClick={() => handleToggleCart(item)}
                    >
                      {isInCart(item._id) ? "Remove from Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourites;