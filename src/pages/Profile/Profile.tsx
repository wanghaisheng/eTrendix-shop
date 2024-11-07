import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import deliverySVG from "../../assets/svg/about/delivery.svg";
import { closeSocketConnection } from "../../services/socketService";
import { FaListCheck } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();

  const logOut = () => {
    // Clear user authentication state
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    closeSocketConnection();
    setUserData({
      id: 0,
      name: "",
      shop_name: "",
      email: "",
      phone: "",
      pincode: "",
      address: "",
      area: "",
      landmark: "",
      userType: "",
    });
    // Redirect to the login page or any other appropriate page
    navigate("/"); // Assuming you have a route for the login page
  };

  // const handleDarkModeToggle = (event: any) => {
  //   const isChecked = event.target.checked;
  //   setDarkMode(isChecked);
  // };

  return (
    <>
      <section className="top-space pt-0">
        <div className="profile-detail">
          <div className="media">
            <FaRegUserCircle size={60} className="me-4" />
            <div className="media-body">
              <h2>{userData.phone ? userData.phone : "Guest"}</h2>
              {/* <h6>{userData.phone}</h6> */}
              <Link to="/profile-setting" className="edit-btn">
                Edit
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="sidebar-content">
        <ul className="link-section">
          {/* <li>
            <div>
              <i className="iconly-Setting icli"></i>
              <div className="content toggle-sec w-100">
                <div>
                  <h4>Dark Mode</h4>
                </div>
                <div className="button toggle-btn ms-auto">
                  <input
                    id="darkButton"
                    type="checkbox"
                    className="checkbox"
                    onChange={handleDarkModeToggle}
                    defaultChecked={localStorage.getItem("darkMode") === "true"}
                  />
                  <div className="knobs">
                    <span></span>
                  </div>
                  <div className="layer"></div>
                </div>
              </div>
            </div>
          </li> */}
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
            <Link to="/wishlist">
              <i className="iconly-Heart icli"></i>
              <div className="content">
                <h4>Your Wishlist</h4>
                <h6>Your Save Products</h6>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/addresses">
              <i className="iconly-Location icli"></i>
              <div className="content">
                <h4>Saved Address</h4>
                <h6>Home, office.. </h6>
              </div>
            </Link>
          </li>
          {/* <li>
            <a href="#">
              <img src={<deliverySVG} className="img-fluid" alt="" />
              <div className="content">
                <h4>Langauge</h4>
                <h6>Select your Language here..</h6>
              </div>
            </a>
          </li> */}
          {/* <li>
            <a href="notification.html">
              <i className="iconly-Notification icli"></i>
              <div className="content">
                <h4>Notification</h4>
                <h6>Offers, Order tracking messages..</h6>
              </div>
            </a>
          </li> */}
          {/* <li>
            <a href="settings.html">
              <i className="iconly-Setting icli"></i>
              <div className="content">
                <h4>Settings</h4>
                <h6>Dark mode, RTL, Notification</h6>
              </div>
            </a>
          </li> */}
          <li>
            <Link to="/profile-setting">
              <i className="iconly-Password icli"></i>
              <div className="content">
                <h4>Profile setting</h4>
                <h6>Full Name, Password..</h6>
              </div>
            </Link>
          </li>
        </ul>

        {(userData?.userType == "storePerson" ||
          userData?.userType == "store") && (
          <>
            <div className="divider"></div>
            <ul className="link-section">
              <li>
                <Link to="/store-panel">
                  <img src={deliverySVG} className="img-fluid" alt="" />
                  <div className="content">
                    <h4>Store Panel</h4>
                    <h6>Active Orders, Out for delivery Orders..</h6>
                  </div>
                </Link>
              </li>
            </ul>
          </>
        )}

        <div className="divider"></div>
        <ul className="link-section">
          <li>
            <Link to="/terms-condition">
              <FaListCheck className="me-4" />
              <div className="content">
                <h4>Terms & Conditions</h4>
                <h6>T&C for use of Platform</h6>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/privacy-policy">
              <GoChecklist className="me-4" />
              <div className="content">
                <h4>Privacy Policy</h4>
                <h6>Privacy and policies of our platform</h6>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/about-us">
              <i className="iconly-Info-Square icli"></i>
              <div className="content">
                <h4>About us</h4>
                <h6>Customer Support, FAQs</h6>
              </div>
            </Link>
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
      <div className="px-15">
        <button
          onClick={logOut}
          className="btn btn-outline w-100 content-color"
        >
          {userData.phone ? "LOG OUT" : "LOG IN"}
        </button>
      </div>
    </>
  );
};

export default Profile;
