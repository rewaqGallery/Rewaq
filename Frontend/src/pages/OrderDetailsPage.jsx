import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import "./style/OrderDetailsPage.css";

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.data);
      } catch (err) {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>No order found</p>;

  return (
    <section
      className="order-details-page container"
      aria-labelledby="orderTitle"
    >
      <h2 id="orderTitle">Order Details</h2>

      <div className="order-layout">
        {/* LEFT SIDE */}
        <section className="order-card-box" aria-label="Order information">
          {/* Header */}
          <header className="order-header-top">
            <span className="order-number">Order #{order._id.slice(-6)}</span>

            <span
              className={`status-badge ${
                order.isPaid ? "status-paid" : "status-unpaid"
              }`}
              role="status"
            >
              {order.isPaid ? "Paid" : "Not Paid"}
            </span>
          </header>

          {/* Shipping */}
          <section className="shipping-box" aria-label="Shipping details">
            <p>
              <strong>Name:</strong> {order?.shippingAddress?.name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {order.shippingAddress?.detailedAddress || "N/A"}
            </p>
            <p>
              <strong>Governorate:</strong>{" "}
              {order.shippingAddress?.governorate || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {order.shippingAddress?.city || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"}
            </p>
          </section>

          {/* Items */}
          <ul className="order-items" aria-label="Order items">
            {order.orderItems.map((item) => (
              <li key={item._id} className="order-item-row">
                <img
                  src={item.product?.imageCover?.url}
                  alt={item.product?.description || "Product image"}
                  loading="lazy"
                />

                <div className="item-info">
                  <p>{item.product?.description}</p>
                  <p>Qty: {item.quantity}</p>
                </div>

                <div className="item-price">
                  {(item.price * item.quantity).toLocaleString()} LE
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* //! RIGHT SIDE - SUMMARY */}
        <aside className="order-summary-card" aria-label="Order summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-line">
            <span>Items</span>
            <span>{order.orderItems.length}</span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span>{order.shippingPrice || 0} LE</span>
          </div>

          <div className="summary-total">
            <span>Total </span>
            <span>{order.totalOrderPrice?.toLocaleString()} LE</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
