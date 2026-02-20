import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { getToken } from "./services/api";
import { fetchCart } from "./store/cartSlice";
import { fetchFavourites } from "./store/favouritesSlice";

import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

import AppRoutes from "./routes/AppRoutes";
import LoginRegister from "./pages/LoginRegister";

export default function App() {
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    dispatch(fetchCart());
    dispatch(fetchFavourites());
  }, [dispatch]);

  const toggleAuthPopup = useCallback(() => {
    setShowAuth((prev) => !prev);
  }, []);

  return (
    <ErrorBoundary>
      <Header onLoginClick={toggleAuthPopup} />
      <ScrollToTop />

      <AppRoutes />

      {showAuth && <LoginRegister onClose={toggleAuthPopup} />}
      <Footer />
    </ErrorBoundary>
  );
}
