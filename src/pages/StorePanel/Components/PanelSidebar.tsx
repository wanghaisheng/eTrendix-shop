import { useUser } from "../../../context/UserContext";
import { Link } from "react-router-dom";
import SellerService from "../../../services/SellerService";
import { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-toastify";
import UserService from "../../../services/UserService";

const PanelSideBar = ({ showPanelSidebar, setShowPanelSidebar }: any) => {
  const { userData } = useUser();
  const [stats, setStats] = useState<any>();
  const [storeType, setStoreType] = useState<number>(0);

  const fetchOrderStats = async () => {
    try {
      const response = await SellerService.fetchOrderStats();
      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await UserService.me();
      if (response.status === 200) {
        setStoreType(response.data.user.status ? 1 : 0);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateStoreStatus = async (type: boolean) => {
    const ToastID = toast.loading("Please wait...");

    try {
      const response = await SellerService.updateStoreStatus(type);
      if (response.data.status === "success") {
        setStoreType(type ? 1 : 0);
        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 1000,
        });
      }
    } catch (error: any) {
      console.error("Error updating delivery type:", error);
      toast.update(ToastID, {
        render: error.response.data.message,
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
    }
  };

  const handleLinkClick = () => {
    setShowPanelSidebar(false);
  };

  return (
    <>
      <div
        className={"overlay-sidebar" + (showPanelSidebar ? " show" : "")}
        onClick={() => {
          setShowPanelSidebar(false);
        }}
      ></div>
      <div className={"header-sidebar" + (showPanelSidebar ? " show" : "")}>
        <Link onClick={handleLinkClick} to="/profile" className="user-panel">
          <img
            src="/src/assets/images/user/1.png"
            className="img-fluid user-img"
            alt=""
          />
          <span>
            Hello, {userData.shop_name ? userData.shop_name : userData.phone}
          </span>
          <i className="iconly-Arrow-Right-2 icli"></i>
        </Link>
        <div className="sidebar-content">
          <ul className="link-section mb-2">
            <li>
              <div>
                <TbTruckDelivery />
                <div className="content toggle-sec w-100">
                  <div>
                    <h4 className="mb-0">Go Live</h4>
                  </div>
                  <div className="button toggle-btn ms-auto">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={!!storeType} // Toggle state between Free and Paid
                      onChange={() => updateStoreStatus(!storeType)} // Invert current delivery type
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
              <Link onClick={handleLinkClick} to="/profile-setting">
                <i className="iconly-Setting icli"></i>
                <div className="content">
                  <h4>Profile Settings</h4>
                </div>
              </Link>
            </li>
          </ul>
          <div>
            {/* Orders Section */}
            <nav className="navbar navbar-light bg-light mb-2">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">
                  Orders
                </a>
              </div>
            </nav>
            <ul className="link-section">
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/pending"
                >
                  Pending Orders{" "}
                  {stats?.pending > 0 && (
                    <span className="badge bg-danger mx-2">
                      ({stats?.pending})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/active"
                >
                  Active Orders{" "}
                  {stats?.active > 0 && (
                    <span className="badge bg-danger mx-2">
                      ({stats?.active})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/outForDelivery"
                >
                  Out for Delivery Orders{" "}
                  {stats?.outForDelivery > 0 && (
                    <span className="badge bg-success mx-2">
                      ({stats?.outForDelivery})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/shipped"
                >
                  Shipped Orders{" "}
                  {stats?.shipped > 0 && (
                    <span className="badge bg-success mx-2">
                      ({stats?.shipped})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/return"
                >
                  Return Requests{" "}
                  {stats?.returnRequest > 0 && (
                    <span className="badge bg-danger mx-2">
                      ({stats?.returnRequest})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/replace"
                >
                  Replace Requests{" "}
                  {stats?.replaceRequest > 0 && (
                    <span className="badge bg-danger mx-2">
                      ({stats?.replaceRequest})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/cancelled"
                >
                  Canceled Orders{" "}
                  {stats?.cancelled > 0 && (
                    <span className="badge bg-danger mx-2">
                      ({stats?.cancelled})
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleLinkClick}
                  to="/store-panel/assignedOrders/returned"
                >
                  Returned Orders{" "}
                  {stats?.returned > 0 && (
                    <span className="badge bg-danger mx-2">
                      ({stats?.returned})
                    </span>
                  )}
                </Link>
              </li>
            </ul>
            {/* Products Section */}
            {userData.userType === "store" && (
              <>
                <nav className="navbar navbar-light bg-light mb-2">
                  <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                      Products
                    </a>
                  </div>
                </nav>
                <ul className="link-section">
                  <li>
                    <Link onClick={handleLinkClick} to="/store-panel/inventory">
                      Inventory
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/store-panel/add-to-inventory"
                    >
                      Add to Inventory
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/store-panel/add-product"
                    >
                      Add Product
                    </Link>
                  </li>
                </ul>

                {/* Store Section */}

                <nav className="navbar navbar-light bg-light mb-2">
                  <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                      Store
                    </a>
                  </div>
                </nav>
                <ul className="link-section">
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/store-panel/add-store-person"
                    >
                      Add Store Person
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/store-panel/store-persons"
                    >
                      Store Persons
                    </Link>
                  </li>
                </ul>

                {/* Logistics Section */}
                <nav className="navbar navbar-light bg-light mb-2">
                  <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                      Logistics
                    </a>
                  </div>
                </nav>
                <ul className="link-section">
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/store-panel/deliverable-addresses"
                    >
                      Deliverable Addresses
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/store-panel/delivery-charges"
                    >
                      Delivery Charges
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PanelSideBar;
