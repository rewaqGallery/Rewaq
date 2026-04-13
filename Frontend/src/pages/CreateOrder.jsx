import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCart, clearCart } from "../store/cartSlice";
import { getToken } from "../services/api";
import { createOrder } from "../services/orderService";
import { governorates } from "../utils/governorates";

import Alert from "../components/Alert";
import Loading from "../components/Loading";

import "./style/CreateOrder.css";

function CreateOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  const { items, loading } = useSelector((state) => state.cart);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    detailedAddress: "",
    phone: "",
    name: "",
    city: "",
    governorate: "",
    postalCode: "",
  });
  const [shippingPrice, setShippingPrice] = useState(0);

  const generateIdempotencyKey = () => {
    return crypto.randomUUID?.() || Date.now().toString();
  };

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
    else if (items.length === 0) dispatch(fetchCart());
  }, [dispatch, token, items.length, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

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

  // Client-side validation
  const validate = () => {
    const newErrors = {};

    if (!shippingAddress.governorate)
      newErrors.governorate = "Governorate is required";

    if (!shippingAddress.city.trim()) newErrors.city = "City is required";

    if (!shippingAddress.detailedAddress.trim())
      newErrors.detailedAddress = "Address is required";

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(shippingAddress.phone)) {
      newErrors.phone = "Invalid Egyptian phone number";
    }

    if (!shippingAddress.name.trim()) newErrors.name = "Name is required";

    if (
      shippingAddress.postalCode &&
      !/^[0-9]+$/.test(shippingAddress.postalCode)
    ) {
      newErrors.postalCode = "Postal code must be numbers only";
    }

    if (shippingPrice === 0) {
      newErrors.governorate = "Select a valid governorate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    // setError(null);
    // if (shippingPrice === 0) {
    //   setError("Please select a valid governorate");
    //   return;
    // }
    // if (
    //   !shippingAddress.detailedAddress ||
    //   !shippingAddress.phone ||
    //   !shippingAddress.city ||
    //   !shippingAddress.governorate
    // ) {
    //   setError("Please fill all required fields");
    //   return;
    // }
    if (submitting) return;

    setError(null);

    if (!validate()) return;
    try {
      setSubmitting(true);

      const orderData = {
        detailedAddress: shippingAddress.detailedAddress,
        phone: shippingAddress.phone,
        governorate: shippingAddress.governorate,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        name: shippingAddress.name,
        shippingPrice,
        paymentMethod: "cash",
        idempotencyKey: generateIdempotencyKey(),
      };

      await createOrder(orderData);
      dispatch(clearCart());
      setShowPopup(true);
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((e) => {
          backendErrors[e.field] = e.msg;
        });
        setErrors(backendErrors);
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading) return <Loading text="Loading order..." />;

  return (
    <main className="make-order-page">
      <section className="make-order-container">
        <header>
          <h2 className="make-order-title">Confirm Your Order</h2>
        </header>

        <Alert message={error ? { type: "error", text: error } : null} />
        <section className="order-items">
          <ul>
            {items.map((item) => (
              <li key={item.productId} className="order-item">
                <span>{item.description}</span>
                <span>
                  {item.quantity} × {item.price} LE
                </span>
              </li>
            ))}
          </ul>
        </section>

        <form className="shipping-form" onSubmit={(e) => e.preventDefault()}>
          <h3 className="form-title">Shipping Address</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={shippingAddress.name}
                onChange={handleChange}
                placeholder="your name"
                disabled={submitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="error">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                disabled={submitting}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <span id="phone-error" className="error">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="governorate">Governorate</label>
              <select
                id="governorate"
                name="governorate"
                value={shippingAddress.governorate}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={!!errors.governorate}
                aria-describedby={
                  errors.governorate ? "governorate-error" : undefined
                }
              >
                <option value="">Select Governorate</option>
                {Object.entries(governorates).map(([name, price]) => (
                  <option key={name} value={name}>
                    {name} ({price} EGP)
                  </option>
                ))}
              </select>
              {errors.governorate && (
                <span id="governorate-error" className="error">
                  {errors.governorate}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="Cairo"
                disabled={submitting}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "city-error" : undefined}
              />{" "}
              {errors.city && (
                <span id="city-error" className="error">
                  {errors.city}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Detailed Address</label>
            <textarea
              id="address"
              name="detailedAddress"
              value={shippingAddress.detailedAddress}
              onChange={handleChange}
              placeholder="Street, building, apartment..."
              disabled={submitting}
              aria-invalid={!!errors.detailedAddress}
              aria-describedby={
                errors.detailedAddress ? "detailedAddress-error" : undefined
              }
            />
            {errors.detailedAddress && (
              <span id="detailedAddress-error" className="error">
                {errors.detailedAddress}
              </span>
            )}
          </div>
        </form>

        <section className="order-summary">
          <h3 className="order-total">
            Total: {(totalPrice + shippingPrice).toFixed(2)} LE
          </h3>
          <div className="order-actions">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/cart")}
              disabled={submitting}
            >
              Back to Cart
            </button>
            <button
              type="button"
              className="confirm-btn"
              onClick={handleConfirmOrder}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? <Loading text="" /> : "Confirm Order"}{" "}
            </button>
          </div>
        </section>

        {showPopup && (
          <div
            className="popup-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <div className="popup">
              <h3 id="success-title">Order Created Successfully</h3>
              <button className="popup-close" onClick={() => navigate("/")}>
                Go Home
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default CreateOrder;
