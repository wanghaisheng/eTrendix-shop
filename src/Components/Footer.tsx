import { Link } from "react-router-dom";
import SelectCart from "../pages/Cart/SelectCart";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useBody } from "../context/BodyContext";
import LoginOtp from "../pages/Login/LoginOtp";

const Footer = ({ location }: any) => {
  const [showCart, setShowCart] = useState(false);
  const { cartCount, userData } = useUser();
  const { showLoginForm, setShowLoginForm } = useBody();
  return (
    <>
      <section className="panel-space"></section>
      <div className="bottom-panel">
        <ul>
          <li
            className={
              location.pathname == "/" || location.pathname === ""
                ? "active"
                : ""
            }
          >
            <Link to="/">
              <div className="icon">
                <i className="iconly-Home icli"></i>
                <i className="iconly-Home icbo"></i>
              </div>
              <span>home</span>
            </Link>
          </li>
          <li className={location.pathname == "/category" ? "active" : ""}>
            <Link to="category">
              <div className="icon">
                <i className="iconly-Category icli"></i>
                <i className="iconly-Category icbo"></i>
              </div>
              <span>category</span>
            </Link>
          </li>
          <li>
            <a
              onClick={() => {
                userData.phone ? setShowCart(true) : setShowLoginForm(true);
              }}
            >
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-info">
                  {cartCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
              <div className="icon">
                <i className="iconly-Buy icli"></i>
                <i className="iconly-Buy icbo"></i>
              </div>
              <span>cart</span>
            </a>
          </li>
          <li className={location.pathname == "/wishlist" ? "active" : ""}>
            {userData.phone ? (
              <Link to="wishlist">
                <div className="icon">
                  <i className="iconly-Heart icli"></i>
                  <i className="iconly-Heart icbo"></i>
                </div>
                <span>wishlist</span>
              </Link>
            ) : (
              <a
                onClick={() => {
                  setShowLoginForm(true);
                }}
              >
                <div className="icon">
                  <i className="iconly-Heart icli"></i>
                  <i className="iconly-Heart icbo"></i>
                </div>
                <span>wishlist</span>
              </a>
            )}
          </li>
          <li className={location.pathname == "/profile" ? "active" : ""}>
            {userData.phone ? (
              <Link to="profile">
                <div className="icon">
                  <i className="iconly-Profile icli"></i>
                  <i className="iconly-Profile icbo"></i>
                </div>
                <span>profile</span>
              </Link>
            ) : (
              <a
                onClick={() => {
                  setShowLoginForm(true);
                }}
              >
                <div className="icon">
                  <i className="iconly-Profile icli"></i>
                  <i className="iconly-Profile icbo"></i>
                </div>
                <span>profile</span>
              </a>
            )}
          </li>
        </ul>
      </div>
      <SelectCart setShowCart={setShowCart} showCart={showCart} />
      {!userData.phone && (
        <LoginOtp
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
        />
      )}
    </>
  );
};

export default Footer;
