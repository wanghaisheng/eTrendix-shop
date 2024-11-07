import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserService from "../../services/UserService";
import ShippingDetails from "../../Components/ShippingDetails";
import PriceDetails from "../../Components/PriceDetails";
import OrderListing from "./OrderListing";
import circleGIF from "../../assets/images/check-circle.gif";
import { useUser } from "../../context/UserContext";

const OrderPlaced = () => {
  const { fetchCartCount } = useUser();

  const location = useLocation();
  const receiptID = new URLSearchParams(location.search).get("receiptID");
  const [order, setOrder] = useState<any>({});

  useEffect(() => {
    fetchCartCount();
    const { req, cancel } = UserService.fetchOrder(receiptID);

    req.then((response) => {
      const data = response.data;
      setOrder(data);
    });
    return () => cancel();
  }, []);
  return (
    <>
      {/* order success section start  */}
      <section className="order-success-section px-15 top-space xl-space">
        <div>
          <img src={circleGIF} className="img-fluid" alt="" />
          <h1>Order successfully!</h1>
          <h2>
            Payment is successfully processed and your Order is on the way.
          </h2>
        </div>
      </section>
      {/* order success section end  */}
      {/* order details section start */}
      <section className="px-15">
        <h2 className="page-title">Order Details</h2>
        <div className="details">
          <ul>
            <li className="mb-3 d-block">
              <h4 className="fw-bold mb-1">
                Your order # is: {order.order_id}
              </h4>
              <h4 className="content-color">
                An email receipt including the details about your order has been
                sent to your email ID.
              </h4>
            </li>
            <li className="mb-3 d-block">
              <h4 className="fw-bold mb-1">This order will be shipped to:</h4>
              <ShippingDetails order={order?.orderData} />
            </li>
            <li className="d-block">
              <h4 className="fw-bold mb-1">Payment Method</h4>
              <h4 className="content-color">{order.orderData?.method}</h4>
            </li>
          </ul>
        </div>
      </section>
      <div className="divider"></div>
      {/* order details section end */}

      {/* expected delivery section start */}
      <section className="px-15 pt-0">
        <h2 className="page-title">Order Summary</h2>
        {order && order.orders?.length > 0 && (
          <OrderListing products={order?.orders} showBtn={true} />
        )}
      </section>
      {/* expected delivery section end */}

      {/* order details start */}
      <section className="px-15">
        <PriceDetails order={order} />
      </section>
      {/* order details end */}

      {/* panel space start */}
      <section className="panel-space"></section>
      {/* panel space end */}

      {/* bottom panel start */}
      <div className="delivery-cart cart-bottom">
        <div>
          <div className="left-content">
            <a href="order-tracking.html" className="title-color">
              Track Order
            </a>
          </div>
          <a href="index-2.html" className="btn btn-solid">
            Continue shopping
          </a>
        </div>
      </div>
      {/* bottom panel end */}
    </>
  );
};

export default OrderPlaced;
