import React from "react";
import { Link } from "react-router-dom";
import "./style/footer.css";
import Logo from "../img/Logo.png";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
// import FacebookIcon from "../img/facebook.svg";
// import InstagramIcon from "../img/instagram.svg";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo and Description */}
          <div className="footer-section">
            <Link to="/" className="footer-logo-link">
              <img
                src={Logo}
                alt="Rewaq Gallery Logo"
                className="footer-logo"
              />
            </Link>
            <p className="footer-description">
              Your shop for custom mugs, posters, stickers, and polaroid prints.
              <br />
              Create unique designs that reflect your style.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section quick-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/product">Products</Link>
              </li>
              <li>
                <Link to="/my-orders">Orders</Link>
              </li>
              <li>
                <a
                  href="https://linktr.ee/rewaqgallery?fbclid=IwY2xjawPxnzVleHRuA2FlbQIxMABicmlkETFFSDNjNzFrZHZUUEwxSW90c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHphBZuy0SIDZpML84HqZMhC4r8kTgoQcl35QcxtxP9hfcIEcNyRAApz4SA-x_aem_c71V5Kq9onErWiT5bNaw7g"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-label">Email:</span>
                <a href="mailto:Rewaqgallery1@gmail.com">
                  Rewaqgallery1@gmail.com
                </a>
              </li>
              <li>
                <span className="contact-label">Phone:</span>
                <a href="tel:+20 10 61014924">+20 10 61014924</a>
              </li>
              <div className="social-links">
                <a
                  href="https://web.facebook.com/RewaqG"
                  className="social-link"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={20} color="#fff" />
                </a>
                <a
                  href="https://www.instagram.com/rewaqgallery/"
                  className="social-link"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={20} color="#fff" />
                </a>
              </div>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="developer">
            Programmed by Mohamed Elafandy{" "}
            <a
              href="https://www.linkedin.com/in/mohamed-elafandy-692327181/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              <FaLinkedin size={16} />
            </a>
          </p>

          <p className="copyright">
            &copy; {new Date().getFullYear()} Rewaq Gallery. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
