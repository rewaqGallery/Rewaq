import React from "react";
import "./style/loading.css";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-container" role="status">
      <div className="spinner"></div>
      <span>{text}</span>
    </div>
  );
}
