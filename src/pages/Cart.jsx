import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCartAsync,
  updateQuantityAsync,
  clearCartError,
  clearCartAsync
} from "../store/cartSlice";
import { Link } from "react-router-dom";
import { getToken } from "../services/api";
import ErrorDisplay from "../components/ErrorDisplay";
import "./style/Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const token = getToken();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0,
  );

  if (!token) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h2 className="cart-title">Your Cart</h2>
          <p className="empty-cart">You must login to see your cart</p>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h2 className="cart-title">Your Cart</h2>
          <p className="empty-cart">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>

        <ErrorDisplay
          message={error}
          onRetry={() => dispatch(fetchCart())}
          onDismiss={() => dispatch(clearCartError())}
        />

        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, index) => {
                const stock =
                  (item.currentStock <= 0 ? 0 : item.currentStock) ?? 0;
                const isPreOrder = item.quantity > stock;

                return (
                  <div
                    key={item._id ?? `cart-item-${index}`}
                    className="cart-item"
                  >
                    <div className="item-image">
                      <img src={item.image} alt={item.description} />
                    </div>

                    <div className="item-details">
                      <h3>{item.description}</h3>

                      <p className="item-price">
                        ${Number(item.price || 0).toFixed(2)} each
                      </p>

                      <div className="item-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantityAsync({
                                productId: item.productId,
                                quantity: Math.max(0, item.quantity - 1),
                              }),
                            )
                          }
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantityAsync({
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      {isPreOrder && (
                        <div className="item-preorder-warning">
                          Only <span>{stock}</span> left in stock for <span>"{item.description}"</span>. Any
                          additional quantity will be pre-ordered.
                        </div>
                      )}
                    </div>

                    <div className="item-remove">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeFromCartAsync(item.productId))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h3>Total: ${totalPrice.toFixed(2)}</h3>

              <div className="cart-actions">
                <Link to="/product" className="checkout-btn secondary">
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => dispatch(clearCartAsync())}
                >
                  Clear Cart
                </button>

                <Link to="/create-order" className="checkout-btn primary">
                  Make Order
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
