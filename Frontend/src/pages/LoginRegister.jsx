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

import Alert from "../components/Alert";

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
      setError(
        err?.data?.errors[0]?.msg || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="auth-container">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          ×
        </button>
        <div className="auth-header">
          <h2 id="auth-title">
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
              <button
                type="button"
                className="toggle-link"
                onClick={toggleForm}
              >
                {isLogin ? " Register" : " Login"}
              </button>
            </p>
          )}
        </div>
        <section aria-labelledby="auth-title">
          <form
            className="auth-form"
            onSubmit={handleSubmit}
            aria-describedby={error ? "auth-error" : undefined}
          >
            {!isLogin && !isVerify && !isForgetPassword && (
              <>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="auth-input"
                  name="name"
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  disabled={loading}
                />
              </>
            )}

            {!isVerify && forgetStep !== 3 && (
              <>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="auth-input"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                  autoFocus={isLogin}
                />
              </>
            )}

            {!isVerify && !isForgetPassword && (
              <>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="auth-input"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </>
            )}

            {!isLogin && !isVerify && !isForgetPassword && (
              <>
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  id="passwordConfirm"
                  className="auth-input"
                  name="passwordConfirm"
                  type="password"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </>
            )}

            {(isVerify || forgetStep === 2) && (
              <>
                <p>
                  Check your email for the verification code
                  <br /> <span className="spam">&lt;also check spam&gt;</span>
                </p>

                <label htmlFor="otp">Verification Code</label>
                <input
                  id="otp"
                  className="auth-input"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </>
            )}

            {forgetStep === 3 && (
              <>
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  className="auth-input"
                  name="newPassword"
                  type="password"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <label htmlFor="confirmNewPassword">Confirm Password</label>
                <input
                  id="confirmNewPassword"
                  className="auth-input"
                  name="confirmNewPassword"
                  type="password"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </>
            )}

            <Alert message={error ? { type: "error", text: error } : null} />

            <button className="auth-btn" disabled={loading} aria-busy={loading}>
              {loading ? (
                <>
                  <span className="spinner-inline"></span>
                  <span className="sr-only">Loading</span>
                </>
              ) : (
                "Continue"
              )}
            </button>

            {isLogin && !isForgetPassword && (
              <button
                type="button"
                className="forget-link"
                onClick={() => setIsForgetPassword(true)}
              >
                Forgot Password?
              </button>
            )}

            {isLogin && !isForgetPassword && (
              <>
                <div className="divider">
                  <span>OR</span>
                </div>

                <a
                  className="google-btn"
                  href="https://rewaq-server-production.up.railway.app/auth/google"
                  aria-label="Continue with Google"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google logo"
                  />
                  Continue with Google
                </a>
              </>
            )}
          </form>
        </section>
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
