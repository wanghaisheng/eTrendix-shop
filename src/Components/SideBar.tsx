import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const SideBar = ({ showSidebar, setShowSidebar }: any) => {
  const { userData } = useUser();

  return (
    <>
      <div
        className={"overlay-sidebar" + (showSidebar ? " show" : "")}
        onClick={() => {
          setShowSidebar(false);
        }}
      ></div>
      <div className={"header-sidebar" + (showSidebar ? " show" : "")}>
        <Link to="/profile" className="user-panel">
          <img
            src="/src/assets/images/user/1.png"
            className="img-fluid user-img"
            alt=""
          />
          <span>Hello, {userData.name ? userData.name : "Guest"}</span>
          <i className="iconly-Arrow-Right-2 icli"></i>
        </Link>
        <div className="sidebar-content">
          <ul className="link-section">
            <li>
              <div>
                <i className="iconly-Setting icli"></i>
                <div className="content toggle-sec w-100">
                  <div>
                    <h4 className="mb-0">Dark Mode</h4>
                  </div>
                  <div className="button toggle-btn ms-auto">
                    <input
                      id="darkButton"
                      type="checkbox"
                      className="checkbox"
                    />
                    <div className="knobs">
                      <span></span>
                    </div>
                    <div className="layer"></div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div>
                <i className="iconly-Setting icli"></i>
                <div className="content toggle-sec w-100">
                  <div>
                    <h4 className="mb-0">RTL</h4>
                  </div>
                  <div className="button toggle-btn ms-auto">
                    <input
                      id="rtlButton"
                      type="checkbox"
                      className="checkbox"
                    />
                    <div className="knobs">
                      <span></span>
                    </div>
                    <div className="layer"></div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <a href="pages.html">
                <i className="iconly-Paper icli"></i>
                <div className="content">
                  <h4>Pages</h4>
                  <h6>Elements & Other Pages</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="index-2.html">
                <i className="iconly-Home icli"></i>
                <div className="content">
                  <h4>Home</h4>
                  <h6>Offers, Top Deals, Top Brands</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="category.html">
                <i className="iconly-Category icli"></i>
                <div className="content">
                  <h4>Shop by Category</h4>
                  <h6>Men, Women, Kids, Beauty.. </h6>
                </div>
              </a>
            </li>
            <li>
              <Link to="/order-history">
                <i className="iconly-Document icli"></i>
                <div className="content">
                  <h4>Orders</h4>
                  <h6>Ongoing Orders, Recent Orders..</h6>
                </div>
              </Link>
            </li>
            <li>
              <a href="wishlist.html">
                <i className="iconly-Heart icli"></i>
                <div className="content">
                  <h4>Your Wishlist</h4>
                  <h6>Your Save Products</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="profile.html">
                <i className="iconly-Profile icli"></i>
                <div className="content">
                  <h4>Your Account</h4>
                  <h6>Profile, Settings, Saved Cards...</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="/src/assets/images/flag.png"
                  className="img-fluid"
                  alt=""
                />
                <div className="content">
                  <h4>Langauge</h4>
                  <h6>Select your Language here..</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="notification.html">
                <i className="iconly-Notification icli"></i>
                <div className="content">
                  <h4>Notification</h4>
                  <h6>Offers, Order tracking messages..</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="settings.html">
                <i className="iconly-Setting icli"></i>
                <div className="content">
                  <h4>Settings</h4>
                  <h6>Dark mode, RTL, Notification</h6>
                </div>
              </a>
            </li>
          </ul>
          <div className="divider"></div>
          <ul className="link-section">
            <li>
              <a href="about-us.html">
                <i className="iconly-Info-Square icli"></i>
                <div className="content">
                  <h4>About us</h4>
                  <h6>About Multikart</h6>
                </div>
              </a>
            </li>
            <li>
              <a href="help.html">
                <i className="iconly-Call icli"></i>
                <div className="content">
                  <h4>Help/Customer Care</h4>
                  <h6>Customer Support, FAQs</h6>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
