import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import ShippingDetails from "../../Components/ShippingDetails";
import PriceDetails from "../../Components/PriceDetails";
import RateReviewFrom from "../../Components/RateReviewFrom";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import HelpSection from "./HelpSection";
import { toast } from "react-toastify";
import { useBody } from "../../context/BodyContext";
import checkSVG from "../../assets/svg/check.svg";
import { GoAlert } from "react-icons/go";

const OrderTracking = () => {
  const { id, orderID } = useParams();
  const location = useLocation();
  const [orders, setOrders] = useState<any>({});
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showHelpSection, setShowHelpSection] = useState(false);
  const { toastMessage, toastType } = location.state || {};
  const { setHeaderName }: any = useBody();

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (toastMessage && toastType) {
      // Display toast message
      toast.success(toastMessage);
    }
  }, [toastMessage, toastType]);

  const fetchOrders = async () => {
    try {
      let response;
      if (orderID) {
        response = await UserService.orderTrackingByOrderID(id, orderID);
      } else {
        response = await UserService.orderTracking(id);
      }

      if (response.status === 200) {
        setHeaderName(["Order Tracking"]);
        const orders = response.data.orders;
        setOrders(response.data);

        // Check if all orders have installation as false or if any order has it as false
        const allFalse = orders.every(
          (order: any) => !order.inventoryData.installation
        );
        const anyFalse = orders.some(
          (order: any) => !order.inventoryData.installation
        );

        const allTrue = orders.every(
          (order: any) => order.inventoryData.installation
        );

        if (allTrue) {
          setAlertMessage(
            "This order require installation. A representative from the seller will contact you to arrange the installation. Please do not open the box, as it may void the warranty."
          );
        } else if (allFalse) {
          setAlertMessage(
            "This order is for open box delivery. Please ensure the box is opened by the delivery person and the contents are shown to you. Only after verifying the contents, please provide the OTP to complete the delivery."
          );
        } else if (anyFalse) {
          setAlertMessage(
            "One of the products in your order is for open box delivery. Please ensure the box is opened by the delivery person and the contents are shown to you. Only after verifying the contents, please provide the OTP to complete the delivery."
          );
        } else {
          setAlertMessage(""); // No message if no items have open box delivery
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* product detail start */}
      <div className="map-product-section px-15">
        {orders.orders?.map((order: any, key: any) => {
          return (
            <div className="product-inline" key={key}>
              <Link to={`/product/${order.product_id?.slug}`}>
                <img
                  src={order.product_id?.images && order.product_id?.images[0]}
                  className="img-fluid"
                  alt=""
                />
              </Link>
              <div className="product-inline-content">
                <div>
                  <Link to={`/product/${order.product_id?.slug}`}>
                    <h4>{order.product_id?.name}</h4>
                    <h5 className="content-color my-1">
                      By: {order.product_id?.company}
                    </h5>
                  </Link>
                  <h5 className="content-color">Qty: {order?.quantity}</h5>
                  {!order.inventoryData.installation && (
                    <span className="badge text-bg-info">
                      Open Box Delivery
                    </span>
                  )}

                  <div className="price">
                    <h4>₹{order?.amount}</h4>
                    <p>Shipping Charge: ₹{order.delivery_charge}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {orders?.orderData?.otp && (
          <>
            <div className="alert alert-info" role="alert">
              OTP: <strong> {orders?.orderData?.otp}</strong>
            </div>
            {alertMessage && (
              <div
                className="alert alert-primary d-flex align-items-center"
                role="alert"
              >
                <GoAlert
                  className="me-2"
                  style={{ fontSize: "24px", color: "#007bff" }}
                />
                {alertMessage}
              </div>
            )}
          </>
        )}
      </div>
      {/* product detail end */}
      {/* order tracking start */}
      <div className="order-track px-15">
        {orders?.orderData?.statusLog?.map((status: any, key: any) => {
          return (
            <div
              className={
                "order-track-step " +
                (status.updated_at == null && "in-process")
              }
              key={key}
            >
              <div className="order-track-status">
                <span className="order-track-status-dot">
                  <img src={checkSVG} className="img-fluid" alt="" />
                </span>
                <span className="order-track-status-line"></span>
              </div>
              <div className="order-track-text">
                <p className="order-track-text-stat">{status.status}</p>
                <span className="order-track-text-sub">
                  {status.updated_at}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rate-section px-15">
        <ul>
          {orders?.orderData?.status == 3 && (
            <>
              <li
                className="px-3"
                onClick={() => {
                  setShowRatingForm(true);
                }}
              >
                <i className="iconly-Star icli"></i>Rate & Review Product
              </li>
              <RateReviewFrom
                orders={orders?.orders}
                showRatingForm={showRatingForm}
                setShowRatingForm={setShowRatingForm}
              />
            </>
          )}
          <li onClick={() => setShowHelpSection(true)}>
            <LiaHandsHelpingSolid />
            Need Help?
          </li>
          <HelpSection
            showHelpSection={showHelpSection}
            setShowHelpSection={setShowHelpSection}
            orders={orders?.orders}
            status={orders?.orderData?.status}
            isReplacement={orders?.orderData?.isReplacement}
          />
        </ul>
      </div>
      <div className="divider"></div>
      {/* order tracking end */}
      {/* address section start */}
      <ShippingDetails order={orders?.orderData} />
      <div className="divider"></div>
      {/* address section end */}
      {/* order details section start */}
      <div className="px-15 section-b-space">
        <h6 className="tracking-title content-color">Price Details</h6>
        <PriceDetails order={orders} />
      </div>
      {/* order details section end */}
    </div>
  );
};

export default OrderTracking;
