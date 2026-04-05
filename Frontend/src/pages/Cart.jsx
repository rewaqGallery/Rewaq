import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchCart,
  removeFromCartAsync,
  updateQuantityAsync,
  clearCartError,
  clearCartAsync,
} from "../store/cartSlice";

import ErrorDisplay from "../components/ErrorDisplay";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

import "./style/Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { items, loading, error } = useSelector((state) => state.cart);

  const [alert, setAlert] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState({
    id: null,
    type: null,
  });

  useEffect(() => {
    if (token && items.length === 0) {
      dispatch(fetchCart());
    }
  }, [dispatch, token, items.length]);

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0,
  );

  const handleRemove = async (id) => {
    setLoadingBtn({ id, type: "remove" });
    try {
      await dispatch(removeFromCartAsync(id)).unwrap();
      setAlert({ type: "success", text: "Item removed" });
    } catch {
      setAlert({ type: "error", text: "Failed to remove item" });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

  const handleQuantity = async (item, newQty) => {
    if (newQty < 1) {
      return handleRemove(item.productId);
    }

    setLoadingBtn({ id: item.productId, type: "qty" });

    try {
      await dispatch(
        updateQuantityAsync({
          productId: item.productId,
          quantity: newQty,
        }),
      ).unwrap();
    } catch {
      setAlert({ type: "error", text: "Failed to update quantity" });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

  const handleClearCart = async () => {
    setLoadingBtn({ id: "all", type: "clear" });
    try {
      await dispatch(clearCartAsync()).unwrap();
      setAlert({ type: "success", text: "Cart cleared" });
    } catch {
      setAlert({ type: "error", text: "Failed to clear cart" });
    } finally {
      setLoadingBtn({ id: null, type: null });
    }
  };

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
    return <Loading text="Loading Cart..." />;
  }

  return (
    <section className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>

        <Alert message={alert} />

        <ErrorDisplay
          message={error}
          onRetry={() => dispatch(fetchCart())}
          onDismiss={() => dispatch(clearCartError())}
        />

        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((item, index) => {
                const stock =
                  (item.currentStock <= 0 ? 0 : item.currentStock) ?? 0;
                const isPreOrder = item.quantity > stock;

                return (
                  <li key={item._id ?? `cart-${index}`} className="cart-item">
                    <div className="item-image">
                      <img
                        src={item.image}
                        alt={item.description || "product"}
                        loading="lazy"
                      />
                    </div>

                    <div className="item-details">
                      <h3>{item.description}</h3>

                      <p className="item-price">
                        {isNaN(item.priceAfterDiscount)
                          ? Number(item.price).toFixed(2)
                          : Number(item.priceAfterDiscount).toFixed(2)}
                      </p>

                      <div className="item-quantity">
                        <button
                          onClick={() =>
                            handleQuantity(item, item.quantity - 1)
                          }
                          disabled={
                            loadingBtn.id === item.productId &&
                            loadingBtn.type === "qty"
                          }
                        >
                          {loadingBtn.id === item.productId &&
                          loadingBtn.type === "qty"
                            ? "..."
                            : "-"}
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            handleQuantity(item, item.quantity + 1)
                          }
                          disabled={
                            loadingBtn.id === item.productId &&
                            loadingBtn.type === "qty"
                          }
                        >
                          {loadingBtn.id === item.productId &&
                          loadingBtn.type === "qty"
                            ? "..."
                            : "+"}
                        </button>
                      </div>

                      {isPreOrder && (
                        <div className="item-preorder-warning">
                          Only <span>{stock}</span> left. Extra will be
                          pre-ordered.
                        </div>
                      )}
                    </div>

                    <div className="item-remove">
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={
                          loadingBtn.id === item.productId &&
                          loadingBtn.type === "remove"
                        }
                      >
                        {loadingBtn.id === item.productId &&
                        loadingBtn.type === "remove"
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-summary">
              <h3>Total: ${totalPrice.toFixed(2)}</h3>

              <div className="cart-actions">
                <Link to="/product" className="checkout-btn secondary">
                  Continue Shopping
                </Link>

                <button
                  className="clear-btn"
                  onClick={handleClearCart}
                  disabled={
                    loadingBtn.id === "all" && loadingBtn.type === "clear"
                  }
                >
                  {loadingBtn.id === "all" && loadingBtn.type === "clear"
                    ? "Clearing..."
                    : "Clear Cart"}
                </button>

                <Link to="/create-order" className="checkout-btn">
                  Make Order
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
