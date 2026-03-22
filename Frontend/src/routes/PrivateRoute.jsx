import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;  
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />; // Forbidden -> redirect home
  }

  return children;
}

export default AdminRoute;
