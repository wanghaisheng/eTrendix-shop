import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/vendors/slick.css";
import "./assets/css/vendors/slick-theme.css";
import "./assets/css/vendors/iconly.css";
import "./assets/css/style.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import Footer from "./Components/Footer";
import Header from "./Components/Header";
import { UserProvider } from "./context/UserContext";
import { BodyProvider } from "./context/BodyContext";
import Loader from "./Components/Loader";
import ComingSoon from "./pages/Home/ComingSoon";

// Dynamic imports
const Home = React.lazy(() => import("./pages/Home/Home"));
const SellerOnBoard = React.lazy(() => import("./pages/SignUp/SellerOnBoard"));

const Category = React.lazy(() => import("./pages/Category/Category"));
const SubCategory = React.lazy(() => import("./pages/Category/SubCategory"));
const Products = React.lazy(() => import("./pages/Products/Products"));
const Product = React.lazy(() => import("./pages/Product/Product"));
const LoginOtp = React.lazy(() => import("./pages/Login/LoginOtp"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
// const SignUp = React.lazy(() => import("./pages/SignUp/SignUp"));
const ProfileSetting = React.lazy(
  () => import("./pages/Profile/ProfileSetting")
);
const Addresses = React.lazy(() => import("./pages/Profile/Addresses"));
const NewAddress = React.lazy(() => import("./pages/Profile/NewAddress"));
const Cart = React.lazy(() => import("./pages/Cart/Cart"));
const EmptyCart = React.lazy(() => import("./pages/Cart/EmptyCart"));
const Payment = React.lazy(() => import("./pages/Payment/Payment"));
const Razor = React.lazy(() => import("./pages/Payment/Razor"));
const Paytm = React.lazy(() => import("./pages/Payment/Paytm"));
const OrderPlaced = React.lazy(() => import("./pages/Orders/OrderPlaced"));
const OrderFailed = React.lazy(() => import("./pages/Orders/OrderFailed"));
const OrderHistory = React.lazy(() => import("./pages/Orders/OrderHistory"));
const OrderTracking = React.lazy(() => import("./pages/Orders/OrderTracking"));
const OrderRecieve = React.lazy(() => import("./pages/Orders/OrderRecieve"));
const OrderReturn = React.lazy(() => import("./pages/Orders/OrderReturn"));
const Mappls = React.lazy(() => import("./Components/Mappls"));
const NewAddressLocation = React.lazy(
  () => import("./pages/Profile/NewAddressLocation")
);
const Test = React.lazy(() => import("./pages/Test"));
const PincodeSelect = React.lazy(() => import("./pages/Profile/PincodeSelect"));
const ProductReviews = React.lazy(
  () => import("./pages/Product/ProductReviews")
);
const Wishlist = React.lazy(() => import("./pages/Cart/Wishlist"));
const Search = React.lazy(() => import("./pages/Products/Search"));
const StorePage = React.lazy(() => import("./pages/Store/StorePage"));
const Notifications = React.lazy(
  () => import("./pages/Notifications/Notifications")
);
const StorePanel = React.lazy(() => import("./pages/StorePanel/Panel"));
const AssignedOrdersStatus = React.lazy(
  () => import("./pages/StorePanel/AssignedOrdersStatus")
);
const Inventory = React.lazy(() => import("./pages/StorePanel/Inventory"));
const AddToInventory = React.lazy(
  () => import("./pages/StorePanel/AddToInventory")
);
const AddProduct = React.lazy(() => import("./pages/StorePanel/AddProduct"));
const AddStorePerson = React.lazy(
  () => import("./pages/StorePanel/AddStorePerson")
);
const StorePersonList = React.lazy(
  () => import("./pages/StorePanel/StorePersonList")
);

const DeliverableAddresses = React.lazy(
  () => import("./pages/StorePanel/DeliverableAddresses")
);

const DeliveryCharges = React.lazy(
  () => import("./pages/StorePanel/DeliveryCharges")
);

const TermsAndConditions = React.lazy(
  () => import("./pages/Policy/TermsAndConditions")
);

const Policy = React.lazy(() => import("./pages/Policy/Policy"));
const Aboutus = React.lazy(() => import("./pages/Policy/Aboutus"));

function App() {
  const location = useLocation();

  const noHeader = ["/np", "/seller-onboarding", "/coming-soon"];

  const noFooter = [
    "/addresses",
    "/addresses/new-address",
    "/cart",
    "/payment",
    "/razor-payment",
    "/paytm-payment",
    "/order-tracking/",
    "/orderRecieve",
    "/addresses/select-location",
    "/seller-onboarding",
    "/terms-condition",
    "/privacy-policy",
    "/about-us",
    "/coming-soon",
  ];

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    if (isDarkMode) {
      document.body.classList.add("dark");
      import("./assets/css/dark.css"); // Dynamically import dark mode stylesheet
    } else {
      document.body.classList.remove("dark");
      // Remove dark mode stylesheet if it was previously loaded
      const darkStylesheet = document.querySelector(
        "link[href*='./assets/css/dark.css']"
      );
      if (darkStylesheet) {
        darkStylesheet.remove();
      }
    }
  }, [isDarkMode]);

  return (
    <Suspense fallback={<Loader />}>
      <BodyProvider>
        <ToastContainer position="top-center" theme="colored" />
        <UserProvider>
          {!noHeader.some((path) => location.pathname.startsWith(path)) && (
            <Header />
          )}
          <Routes>
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/terms-condition" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<Policy />} />
            <Route path="/about-us" element={<Aboutus />} />
            <Route path="/category/:category" element={<Products />} />
            <Route path="/categories/:category" element={<SubCategory />} />
            <Route
              path="/category/:category/:subCategory"
              element={<Products />}
            />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/product/:slug/reviews" element={<ProductReviews />} />
            <Route path="/login" element={<LoginOtp />} />
            <Route path="/loginA" element={<Login />} />
            <Route path="/seller-onboarding" element={<SellerOnBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-setting" element={<ProfileSetting />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/addresses/new-address" element={<NewAddress />} />
            <Route
              path="/addresses/new-address-location"
              element={<NewAddressLocation />}
            />
            <Route path="/cart/:pincodeID" element={<Cart />} />
            <Route path="/empty-cart" element={<EmptyCart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/razor-payment" element={<Razor />} />
            <Route path="/paytm-payment" element={<Paytm />} />
            <Route path="/order-placed" element={<OrderPlaced />} />
            <Route path="/order-failed" element={<OrderFailed />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-tracking/:id" element={<OrderTracking />} />
            <Route
              path="/order-tracking/:id/order/:orderID"
              element={<OrderTracking />}
            />
            <Route path="/addresses/select-location" element={<Mappls />} />
            <Route path="/orderRecieve" element={<OrderRecieve />} />
            <Route path="/orderReturn" element={<OrderReturn />} />
            <Route path="/pincode-select" element={<PincodeSelect />} />
            <Route path="/shop/:slug" element={<StorePage />} />
            <Route path="/notifications/:link" element={<Notifications />} />
            <Route path="/store-panel" element={<StorePanel />} />
            <Route path="/store-panel/inventory" element={<Inventory />} />
            <Route
              path="/store-panel/add-to-inventory"
              element={<AddToInventory />}
            />
            <Route
              path="/store-panel/assignedOrders/:status"
              element={<AssignedOrdersStatus />}
            />
            <Route path="/store-panel/add-product" element={<AddProduct />} />
            <Route
              path="/store-panel/add-store-person"
              element={<AddStorePerson />}
            />

            <Route
              path="/store-panel/store-persons"
              element={<StorePersonList />}
            />

            <Route
              path="/store-panel/deliverable-addresses"
              element={<DeliverableAddresses />}
            />

            <Route
              path="/store-panel/delivery-charges"
              element={<DeliveryCharges />}
            />

            <Route path="/test" element={<Test />} />
          </Routes>
          {!noFooter.some((path) => location.pathname.startsWith(path)) && (
            <Footer location={location} />
          )}
        </UserProvider>
      </BodyProvider>
    </Suspense>
  );
}

export default App;
