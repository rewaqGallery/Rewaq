import Slider from "../components/Slider";
import Products from "../components/Products";
import BtnHeader from "../components/BtnHeader";
import { Link } from "react-router-dom";
import "./style/Home.css"
function Home() {
  return (
    <main>
      <BtnHeader />
      <Slider />

      <section className="home-products">
        <div className="section-header">
          <h2>Featured Products</h2>
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
