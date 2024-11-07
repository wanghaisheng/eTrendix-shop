import { Link, useParams } from "react-router-dom";
import SellerService from "../../services/SellerService";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import OrderListing from "../Orders/OrderListing";
import PriceDetails from "../../Components/PriceDetails";
import ShippingDetails from "../../Components/ShippingDetails";
import { toast } from "react-toastify";
import { useBody } from "../../context/BodyContext";

interface SelectedPerson {
  personID: string;
  orderID: string;
}

const AssignedOrdersStatus = () => {
  const { setHeaderName }: any = useBody();
  const { status } = useParams();
  const [orders, setOrders] = useState<any>();
  const [order, setOrder] = useState<any>({});
  const [orderModal, setOrderModal] = useState(false);
  const [orderModalLoader, setOrderModalLoader] = useState(false);
  const [processButtonClicked, setProcessButtonClicked] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson[]>([]);

  let statusID = 0;

  const orderBtn: { [key: number]: string } = {
    0: "Process order",
    1: "Process order for delivery",
    2: "View Order Status",
    3: "View Order",
    // Add more statuses and corresponding texts as needed
  };
  if (status === "active") {
    statusID = 1;
  } else if (status === "outForDelivery") {
    statusID = 2;
  } else if (status === "shipped") {
    statusID = 3;
  } else if (status === "cancelled") {
    statusID = 4;
  } else if (status === "return") {
    statusID = 6;
  } else if (status === "replace") {
    statusID = 7;
  } else if (status === "returned") {
    statusID = 8;
  }

  const [filter, setFilter] = useState({
    page: 1,
  });

  const fetchOrders = async () => {
    try {
      const response = await SellerService.fetchOrders(statusID, filter);

      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrder = async (orderID: string) => {
    setOrderModalLoader(true);
    try {
      const response = await SellerService.fetchOrder(orderID, statusID);

      if (response.status === 200) {
        setOrderModal(true);
        setOrder(response.data);
      }
      setOrderModalLoader(false);
    } catch (error) {
      setOrderModalLoader(false);

      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    setHeaderName(["Assigned Orders", status]);
  }, [filter]);

  const ProcessOrder = async () => {
    const ToastID = toast.loading("Please wait...");

    try {
      setProcessButtonClicked(true);
      const response = await SellerService.updateOrder(
        order.orderID,
        [],
        selectedPerson
      );
      const responseData = response.data;
      if (responseData.status === "success") {
        toast.update(ToastID, {
          render: "Order Proccessed!",
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });

        setOrderModal(false);
        setProcessButtonClicked(false);
        fetchOrders();
      }
    } catch (error) {
      toast.update(ToastID, {
        render: "Something went wrong!",
        type: "success",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
      setProcessButtonClicked(false);
      console.log("Error fetching order:", error);
    }
  };

  return (
    <>
      {/*  search panel start  */}
      <div className="search-panel top-space px-15">
        <div className="search-bar">
          <input className="form-control form-theme" placeholder="Search" />
          <i className="iconly-Search icli search-icon"></i>
          <i className="iconly-Camera icli camera-icon"></i>
        </div>
        <div className="filter-btn">
          <i className="iconly-Filter icli"></i>
        </div>
      </div>
      {/*  search panel end  */}
      <section className="px-15">
        {orders?.data.map((order: any, index: number) => {
          return (
            <div className="card mb-4" key={index}>
              <div className="card-body">
                <ul className="order-listing">
                  {order.orderProducts.map((product: any, index: number) => {
                    return (
                      <li key={index}>
                        <div className="order-box">
                          <div className="d-flex align-items-center">
                            <img
                              src={product?.images && product?.images[0]}
                              className="img-fluid order-img"
                              alt=""
                            />
                            <div className="media-body">
                              <h4>{product.name} </h4>
                              <h5 className="content-color my-1">
                                By: {product.company}
                              </h5>
                            </div>
                            {/* <span className="status-label">ongoing</span> */}
                          </div>
                          <div className="delivery-status">
                            <div className="d-flex">
                              <div>
                                <h6 className="content-color">Ordered:</h6>
                                <h6>{order.created_at}</h6>
                              </div>
                              <div>
                                <h6 className="content-color">Tracking ID:</h6>
                                <h6>{product.orderID}</h6>
                              </div>

                              <div>
                                <h6 className="content-color">Order Type:</h6>
                                <h6>{order.method}</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-evenly">
                  <button
                    className="btn btn-secondary "
                    onClick={() => {
                      fetchOrder(order.order_id);
                    }}
                    disabled={orderModalLoader}
                  >
                    {orderBtn[statusID] || "View Details"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {orders?.data && orders?.data.length > 0 && (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                setFilter({ ...filter, page: filter.page + 1 });
              }}
            >
              Next Page
            </button>
          </div>
        )}
        {orders?.data && orders?.data.length === 0 && (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <p className="text-center">
              No data. Go back to{" "}
              <Link to="/store-panel">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Store Panel
                </button>
              </Link>
            </p>
          </div>
        )}
      </section>

      <Modal
        show={orderModal}
        onHide={() => setOrderModal(false)}
        fullscreen={true}
      >
        <Modal.Header>
          <a onClick={() => setOrderModal(false)} className="back-btn">
            <i className="iconly-Arrow-Left icli"></i>
          </a>
          <div className="mx-2">
            <h2>Order Details</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          {order.orders && (
            <OrderListing
              products={order?.orders}
              showBtn={false}
              storePersons={order?.storePersons}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
            />
          )}
          <div className="divider"></div>

          <ShippingDetails order={order.orderData} />
          <div className="divider"></div>
          {order?.orderData?.addressData?.latitude && (
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              src={`https://maps.google.co.uk/maps?q=${order.orderData.addressData.latitude},${order.orderData.addressData.longitude}&output=embed`}
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          )}
          <div className="divider"></div>

          <div className="px-15 section-b-space">
            <h6 className="tracking-title content-color">Price Details</h6>
            <PriceDetails order={order} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOrderModal(false)}>
            Close
          </Button>

          {order.otpConfirmUrl && statusID == 2 && (
            <a
              target="_blank"
              href={order.otpConfirmUrl}
              className="btn btn-info"
            >
              Open Delivery URL
            </a>
          )}

          {order.returnUrl && (
            <a target="_blank" href={order.returnUrl} className="btn btn-info">
              Open Return URL
            </a>
          )}

          {order.orders && statusID < 2 && (
            <Button
              variant="primary"
              onClick={ProcessOrder}
              disabled={processButtonClicked}
            >
              {orderBtn[statusID]}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AssignedOrdersStatus;
