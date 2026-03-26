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
    <div className="order-details-page container">
      <h2>Order Details</h2>

      <div className="order-layout">
        
        {/* LEFT SIDE */}
        <div className="order-card-box">
          
          {/* Header */}
          <div className="order-header-top">
            <span className="order-number">
              Order #{order._id.slice(-6)}
            </span>

            <span
              className={`status-badge ${
                order.isPaid ? "status-paid" : "status-unpaid"
              }`}
            >
              {order.isPaid ? "Paid" : "Not Paid"}
            </span>
          </div>

          {/* Shipping */}
          <div className="shipping-box">
            <p><strong>Address:</strong> {order.shippingAddress?.detailedAddress}</p>
            <p><strong>Governorate:</strong> {order.shippingAddress?.governorate}</p>
            <p><strong>City:</strong> {order.shippingAddress?.city}</p>
            <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
          </div>

          {/* Items */}
          <div className="order-items">
            {order.orderItems.map((item) => (
              <div key={item._id} className="order-item-row">
                <img
                  src={item.product?.imageCover?.url}
                  alt={item.product?.name}
                />

                <div className="item-info">
                  <p>{item.product?.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>

                <div className="item-price">
                  {(item.price * item.quantity).toLocaleString()} LE
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="order-summary-card">
          <div className="summary-title">Order Summary</div>

          <div className="summary-line">
            <span>Items</span>
            <span>{order.orderItems.length}</span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span>{order.shippingPrice || 0} LE</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>{order.totalOrderPrice?.toLocaleString()} LE</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetailsPage;
