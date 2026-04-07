import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import ErrorDisplay from "../components/ErrorDisplay";
import "./style/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authorized. Please login first.");
      }

      const data = await getMyOrders();
      setOrders(data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <p className="loading" role="status">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={fetchOrders}
        onDismiss={() => setError(null)}
        className="container"
      />
    );
  }

  return (
    <section className="my-orders container" aria-labelledby="orders-title">
      <h2 id="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <article key={order._id} className="order-card-wrapper">
              <Link
                to={`/order/${order._id}`}
                className="order-card-link"
                aria-label={`View order ${order._id}`}
              >
                <div className="order-card">
                  <header className="order-header">
                    <span>Order #{order._id.slice(-5)}</span>

                    <span
                      className={`order-status ${
                        order.isPaid ? "paid" : "unpaid"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </header>

                  <div className="order-info">
                    <p>
                      <strong>Total:</strong>{" "}
                      {order.totalOrderPrice.toLocaleString()} LE
                    </p>

                    <p>
                      <strong>Items:</strong> {order.orderItems.length}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      <time dateTime={order.createdAt}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </time>
                    </p>
                  </div>

                  <ul className="order-items">
                    {order.orderItems.map((item) => (
                      <li key={item._id} className="order-item">
                        <img
                          src={item?.product?.imageCover?.url}
                          alt={item?.product?.code || "Product image"}
                          loading="lazy"
                        />

                        <div className="order-item-details">
                          <p className="description">
                            {item?.product?.description}
                          </p>
                          <p>Price: {item.price} LE</p>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyOrders;