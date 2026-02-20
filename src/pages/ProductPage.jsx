import React from "react";
import Products from "../components/Products";
import "../components/style/product.css";
function ProductsPage() {
  return (
    <main>
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          <Products />
        </div>
      </section>
    </main>
  );
}

export default ProductsPage;
