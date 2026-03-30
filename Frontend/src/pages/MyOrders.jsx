import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import "./style/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="loading" role="status">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
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
                      aria-label={order.isPaid ? "Paid" : "Unpaid"}
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
