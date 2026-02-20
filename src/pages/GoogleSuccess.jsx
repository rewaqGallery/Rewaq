import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart } from "../store/cartSlice";
import { fetchFavourites } from "../store/favouritesSlice";

function GoogleSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("token:", token);
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/"); // Clean the URL --Security Reason
      dispatch(fetchCart());
      dispatch(fetchFavourites());
      navigate("/");
    } else {
      navigate("/");
    }
  }, [[location.search]]);

  return <p>Signing you in...</p>;
}

export default GoogleSuccess;
