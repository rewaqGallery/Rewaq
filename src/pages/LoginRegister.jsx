import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signup,
  login,
  verifyAccount,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} from "../services/authService";
import { fetchCart } from "../store/cartSlice";
import { fetchFavourites } from "../store/favouritesSlice";
import "./style/LoginRegister.css";

function LoginRegister({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isVerify, setIsVerify] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [forgetStep, setForgetStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetState = () => {
    setIsVerify(false);
    setIsForgetPassword(false);
    setForgetStep(1);
    setError("");
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetState();
  };

  const afterAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    setUserRole(data.role);
    dispatch(fetchCart());
    dispatch(fetchFavourites());
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isForgetPassword) {
        if (forgetStep === 1) {
          await forgetPassword({ email: formData.email });
          setForgetStep(2);
        } else if (forgetStep === 2) {
          await verifyResetCode({
            email: formData.email,
            passwordResetCode: formData.otp,
          });
          setForgetStep(3);
        } else {
          if (formData.newPassword !== formData.confirmNewPassword)
            throw new Error("Passwords do not match");

          const data = await resetPassword({
            email: formData.email,
            newPassword: formData.newPassword,
            passwordConfirm: formData.confirmNewPassword,
          });
          afterAuthSuccess(data);
        }
      } else if (isVerify) {
        const data = await verifyAccount({
          email: formData.email,
          otp: formData.otp,
        });
        afterAuthSuccess(data);
      } else if (isLogin) {
        const data = await login({
          email: formData.email,
          password: formData.password,
        });
        afterAuthSuccess(data);
      } else {
        if (formData.password !== formData.passwordConfirm)
          throw new Error("Passwords do not match");

        await signup(formData);
        setIsVerify(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="auth-header">
          <h2>
            {isForgetPassword
              ? forgetStep === 1
                ? "Reset Password"
                : forgetStep === 2
                  ? "Verify Code"
                  : "New Password"
              : isVerify
                ? "Verify Account"
                : isLogin
                  ? "Login"
                  : "Register"}
          </h2>

          {!isVerify && !isForgetPassword && (
            <p>
              {isLogin ? "Don't have an account?" : "Already have one?"}
              <span className="toggle-link" onClick={toggleForm}>
                {isLogin ? " Register" : " Login"}
              </span>
            </p>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && !isVerify && !isForgetPassword && (
            <input
              className="auth-input"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          )}

          {!isVerify && forgetStep !== 3 && (
            <input
              className="auth-input"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          )}

          {!isVerify && !isForgetPassword && (
            <input
              className="auth-input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          )}

          {!isLogin && !isVerify && !isForgetPassword && (
            <input
              className="auth-input"
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          )}

          {(isVerify || forgetStep === 2) && (
            <input
              className="auth-input"
              name="otp"
              placeholder="Verification Code"
              onChange={handleChange}
              required
            />
          )}

          {forgetStep === 3 && (
            <>
              <input
                className="auth-input"
                name="newPassword"
                type="password"
                placeholder="New Password"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                name="confirmNewPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Loading..." : "Continue"}
          </button>

          {isLogin && !isForgetPassword && (
            <p
              className="forget-link"
              onClick={() => setIsForgetPassword(true)}
            >
              Forgot Password?
            </p>
          )}

          {isLogin && !isForgetPassword && (
            <>
              <div className="divider">
                <span>OR</span>
              </div>

              <a
                className="google-btn"
                href="https://rewaq-server-production.up.railway.app/auth/google"
                // href="http://localhost:9001/auth/google"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                />
                Continue with Google
              </a>
            </>
          )}
        </form>

        {userRole === "admin" && (
          <div className="admin-link">
            <button onClick={() => navigate("/admin")}>Go to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;
