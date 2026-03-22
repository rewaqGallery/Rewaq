import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchFavourites,
  removeFavouriteAsync,
  clearFavouritesError,
} from "../store/favouritesSlice";

import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";
import * as favouritesService from "../services/favouritesService";

import ErrorDisplay from "../components/ErrorDisplay";

import "./style/Favourites.css";

function Favourites() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { ids, loading, error } = useSelector((state) => state.favourites);
  const cartItems = useSelector((state) => state.cart.items);

  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const res = await favouritesService.getFavourites();
        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    if (token) {
      dispatch(fetchFavourites());
      loadFavourites();
    } else {
      setPageLoading(false);
    }
  }, [dispatch, token]);

  const isInCart = (productId) =>
    cartItems.some(
      (c) => String(c.product?._id ?? c.productId) === String(productId),
    );

  const handleToggleCart = (product) => {
    if (!token) {
      alert("You must login");
      return;
    }

    if (isInCart(product._id)) {
      dispatch(removeFromCartAsync(product._id));
    } else {
      dispatch(
        addToCartAsync({
          productId: product._id,
          quantity: 1,
        }),
      );
    }
  };

  const handleRemoveFavourite = (productId) => {
    dispatch(removeFavouriteAsync(productId));
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  if (loading || pageLoading) {
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

        {products.length === 0 ? (
          <p className="empty-favourites">No favourites yet.</p>
        ) : (
          <div className="favourites-items">
            {products.map((item) => (
              <div key={item._id} className="favourite-item">
                <div className="favourite-image">
                  <img src={item.imageCover?.url ?? item.image} alt={item.description} />
                </div>

                <div className="favourite-details">
                  <h3>{item.description}</h3>

                  <p className="favourite-price">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <div className="favourite-actions">
                    <Link to={`/product/${item._id}`} className="view-btn">
                      View
                    </Link>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFavourite(item._id)}
                    >
                      Remove
                    </button>

                    <button
                      className="cart-btn"
                      onClick={() => handleToggleCart(item)}
                    >
                      {isInCart(item._id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
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