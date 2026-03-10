import Slider from "../components/Slider";
import Products from "../components/Products";
import BtnHeader from "../components/BtnHeader";
import { Link } from "react-router-dom";
import "./style/Home.css";

function Home() {
  return (
    <main>
      <BtnHeader />
      <Slider />

      <section
        className="home-products"
        aria-labelledby="featured-products-title"
      >
        <div className="section-header">
          <h2 id="featured-products-title" className="featured-title">
            Featured Products
          </h2>
          <Link to="/product" className="view-all">
            View all
          </Link>
        </div>
        <Products featured={true} />
      </section>
    </main>
  );
}

export default Home;
