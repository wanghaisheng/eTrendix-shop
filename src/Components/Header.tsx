import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { useBody } from "../context/BodyContext";
import { useUser } from "../context/UserContext";
import { IoCaretDownCircleOutline } from "react-icons/io5";
import LocationSelect from "./LocationSelect";
import { toast } from "react-toastify";
import SearchModal from "./SearchModal";
import Notifications from "./Notifications";
import { initSocketConnection, getSocket } from "../services/socketService"; // Import the socket service
import PanelSideBar from "../pages/StorePanel/Components/PanelSidebar";
import barSVG from "../assets/svg/bar.svg";

const Header = () => {
  const {
    selectedLocation,
    locationString,
    errorString,
    setErrorString,
    userData,
  } = useUser();
  const { headerName, setHeaderName }: any = useBody();
  const location = useLocation();

  const navigate = useNavigate();
  // const modifiedPathname = location.pathname.slice(1);
  // const parts = modifiedPathname.split("/");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPanelSidebar, setShowPanelSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationCount, setShowNotificationCount] = useState(0);
  const [showLocationSelectModal, setShowLocationSelectModal] = useState(false);

  useEffect(() => {
    const headerNames: { [key: string]: string[] } = {
      "/": ["Home"],
      "/category": ["Category"],
      "/category/:category": ["Category", "SubCategory"],
      "/category/:category/:subCategory": [
        "Category",
        "SubCategory",
        "Products",
      ],
      "/product/:slug": ["Product"],
      // "/product/:slug/reviews": ["Product", "Reviews"],
      "/login": ["Login"],
      "/signup": ["Sign Up"],
      "/verifyOtp": ["Verify OTP"],
      "/profile": ["Profile"],
      "/profile-setting": ["Profile Setting"],
      "/addresses": ["Addresses"],
      "/addresses/new-address": ["Addresses", "New Address"],
      "/addresses/new-address-location": ["Addresses", "New Address Location"],
      "/cart/:pincodeID": ["Cart"],
      "/empty-cart": ["Empty Cart"],
      "/wishlist": ["Wishlist"],
      "/payment": ["Payment"],
      "/order-placed": ["Order Placed"],
      "/order-history": ["Order History"],
      "/order-tracking/:id": ["Order Tracking"],
      "/addresses/select-location": ["Addresses", "Select Location"],
      "/orderRecieve/:orderId": ["Order Receive"],
      "/pincode-select": ["Pincode Select"],
      "/store-panel": ["Store Panel"],
      "/store-panel/add-product": ["Store Panel", "Add Product"],
      "/store-panel/add-store-person": ["Store Panel", "Add Store Person"],
      "/store-panel/store-persons": ["Store Panel", "Store Persons"],
      "/store-panel/delivery-charges": ["Store Panel", "Delivery Charges"],
      "/store-panel/deliverable-addresses": [
        "Store Panel",
        "Deliverable Addresses",
      ],
      "/serach": ["Search"],
      "/seller-on-board": ["Seller On Board"],
      "/terms-condition": ["Terms and condtions"],
      "/privacy-policy": ["Privacy Policy"],
      "/about-us": ["About Us"],
    };

    const getHeaderName = () => {
      for (const path in headerNames) {
        const regex = new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`);
        if (regex.test(location.pathname)) {
          return headerNames[path];
        }
      }
      return ["JL"];
    };

    setHeaderName(getHeaderName());
  }, [location, setHeaderName]);

  // show error in toast from all pages
  useEffect(() => {
    if (errorString != "") {
      toast.error(errorString);
      setErrorString("");
    }
  }, [errorString]);

  // socket code
  useEffect(() => {
    console.log("called");

    const token = localStorage.getItem("token");

    // Initialize socket connection
    if (token) {
      initSocketConnection(token);
      const socket = getSocket();

      socket?.on("connect", () => {
        console.log("Connected to server");
      });

      socket?.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      // Listen for new notifications
      socket?.on("newNotification", (notification: any) => {
        console.log(notification);
        toast.info(notification.message, {
          theme: "colored",
        });
        setShowNotificationCount(showNotificationCount + 1);
      });
    }

    // Cleanup socket listener on unmount
    return () => {
      const socket = getSocket();
      socket?.off("newNotification");
    };
  }, [userData]);

  return (
    <>
      <header>
        {location.pathname !== "/" && location.pathname !== "/signup" && (
          <div className="back-links">
            {location.pathname === "/store-panel" ? (
              <div
                className="nav-bar"
                onClick={() => {
                  setShowPanelSidebar(true);
                }}
              >
                <img src={barSVG} className="img-fluid" alt="" />
                <div className="content">
                  <h2>
                    {headerName.length > 0 && headerName[0]}
                    {headerName.slice(1).map(
                      (
                        name:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | null
                          | undefined,
                        index: Key | null | undefined // Adjusted mapping function
                      ) => (
                        <span key={index}>
                          <i className="iconly-Arrow-Right-2 icli"></i> {name}
                        </span>
                      )
                    )}
                  </h2>
                </div>
              </div>
            ) : (
              <a onClick={() => navigate(-1)}>
                <i className="iconly-Arrow-Left icli"></i>
                <div className="content">
                  <h2>
                    {headerName.length > 0 && headerName[0]}
                    {headerName.slice(1).map(
                      (
                        name:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | null
                          | undefined,
                        index: Key | null | undefined // Adjusted mapping function
                      ) => (
                        <span key={index}>
                          <i className="iconly-Arrow-Right-2 icli"></i> {name}
                        </span>
                      )
                    )}
                  </h2>
                </div>
              </a>
            )}
          </div>
        )}

        {location.pathname === "/" && (
          <>
            <div
              className="col-8 text-truncate"
              onClick={() => setShowLocationSelectModal(true)}
            >
              <i className="iconly-Location icli"></i>{" "}
              {locationString && <>{locationString}</>}
              {Object.keys(selectedLocation).length === 0 && (
                <span>Please allow location access</span>
              )}
            </div>
            <IoCaretDownCircleOutline
              onClick={() => setShowLocationSelectModal(true)}
            />
          </>
        )}

        {location.pathname != "/terms-condition" &&
          location.pathname != "/privacy-policy" && (
            <div className="header-option">
              <ul>
                <li>
                  <a onClick={() => setShowSearch(true)}>
                    <i className="iconly-Search icli"></i>
                  </a>
                </li>
                {userData.phone && (
                  <li className="position-relative">
                    {showNotificationCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {showNotificationCount}
                        <span className="visually-hidden">
                          Unread Notifications
                        </span>
                      </span>
                    )}

                    <a onClick={() => setShowNotifications(true)}>
                      <i className="iconly-Notification icli"></i>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
      </header>

      <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <SearchModal showSearch={showSearch} setShowSearch={setShowSearch} />
      {userData.phone && (
        <Notifications
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setShowNotificationCount={setShowNotificationCount}
        />
      )}
      {location.pathname === "/" && (
        <LocationSelect
          showLocationSelectModal={showLocationSelectModal}
          setShowLocationSelectModal={setShowLocationSelectModal}
        />
      )}

      {location.pathname === "/store-panel" && (
        <PanelSideBar
          showPanelSidebar={showPanelSidebar}
          setShowPanelSidebar={setShowPanelSidebar}
        />
      )}
    </>
  );
};

export default Header;
