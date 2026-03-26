import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCart, clearCart } from "../store/cartSlice";
import { getToken } from "../services/api";
import { createOrder } from "../services/orderService";
import "./style/CreateOrder.css";
import { governorates } from "../utils/governorates";

function CreateOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  const { items, loading } = useSelector((state) => state.cart);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    detailedAddress: "",
    phone: "",
    city: "",
    governorate: "",
    postalCode: "",
  });
  const [shippingPrice, setShippingPrice] = useState(0);

  const generateIdempotencyKey = () =>
    crypto.randomUUID?.() || Date.now().toString();

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
    else if (items.length === 0) dispatch(fetchCart());
  }, [dispatch, token, items.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "governorate") {
      setShippingAddress((prev) => ({
        ...prev,
        governorate: value,
        city: "",
      }));

      setShippingPrice(governorates[value] || 0);
    } else {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleConfirmOrder = async () => {
    setError(null);
    if (shippingPrice === 0) {
      setError("Please select a valid governorate");
      return;
    }
    if (
      !shippingAddress.detailedAddress ||
      !shippingAddress.phone ||
      !shippingAddress.city ||
      !shippingAddress.governorate
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        detailedAddress: shippingAddress.detailedAddress,
        phone: shippingAddress.phone,
        governorate: shippingAddress.governorate,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        shippingPrice,
        paymentMethod: "cash",
        idempotencyKey: generateIdempotencyKey(),
      };

      await createOrder(orderData);
      dispatch(clearCart());
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Show popup then navigate home after 3s
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  if (loading) return <p className="loading">Loading order...</p>;

  return (
    <div className="make-order-page">
      <div className="make-order-container">
        <h2 className="make-order-title">Confirm Your Order</h2>

        <div className="order-items">
          {items.map((item) => (
            <div key={item.productId} className="order-item">
              <span>{item.description}</span>
              <span>
                {item.quantity} × {item.price} LE
              </span>
            </div>
          ))}
        </div>

        {error && <p className="order-error">{error}</p>}

        <form className="shipping-form">
          <h3 className="form-title">Shipping Address</h3>
          <div className="form-group">
            <label>Detailed Address</label>
            <textarea
              name="detailedAddress"
              value={shippingAddress.detailedAddress}
              onChange={handleChange}
              placeholder="Street, building, apartment..."
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
              placeholder="01xxxxxxxxx"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Governorate</label>
              <select
                name="governorate"
                value={shippingAddress.governorate}
                onChange={handleChange}
                required
              >
                <option value="">Select Governorate</option>
                {Object.entries(governorates).map(([name, price]) => (
                  <option key={name} value={name}>
                    {name} ({price} EGP)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="Cairo"
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code (optional)</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleChange}
                placeholder="12345"
              />
            </div>
          </div>
        </form>

        <div className="order-summary">
          <h3 className="order-total">
            Total: {totalPrice.toFixed(2)} + {shippingPrice} LE
          </h3>
          <div className="order-actions">
            <button className="back-btn" onClick={() => navigate("/cart")}>
              Back to Cart
            </button>
            <button
              className="confirm-btn"
              onClick={handleConfirmOrder}
              disabled={submitting}
            >
              {submitting ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <p>Order Created Successfully</p>
              <button className="popup-close" onClick={() => navigate("/")}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateOrder;
