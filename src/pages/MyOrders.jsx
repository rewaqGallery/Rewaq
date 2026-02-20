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

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-orders container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <Link
              to={`/order/${order._id}`}
              key={order._id}
              className="order-card-link"
            >
              <div className="order-card">
                
                {/* Header */}
                <div className="order-header">
                  <span>Order #{order._id.slice(-5)}</span>

                  <span
                    className={`order-status ${
                      order.isPaid ? "paid" : "unpaid"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>

                {/* Info */}
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
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Items */}
                <div className="order-items">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="order-item">
                      <img
                        src={item?.product?.imageCover?.url}
                        alt={item?.product?.code}
                      />

                      <div className="order-item-details">
                        <p>{item?.product?.code}</p>
                        <p>Price: {item.price} LE</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
