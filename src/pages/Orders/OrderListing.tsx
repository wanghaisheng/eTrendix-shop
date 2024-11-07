import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const OrderListing = ({
  products,
  showBtn,
  storePersons,
  selectedPerson,
  setSelectedPerson,
}: any) => {
  const { userData } = useUser();

  const addSelectedPerson = (personID: string, orderID: string) => {
    const existingOrderIndex = selectedPerson.findIndex(
      (item: any) => item.orderID === orderID
    );

    if (existingOrderIndex !== -1) {
      const updatedSelectedPerson = [...selectedPerson];
      updatedSelectedPerson[existingOrderIndex].personID = personID;
      setSelectedPerson(updatedSelectedPerson);
    } else {
      setSelectedPerson((prevSelected: any) => [
        ...prevSelected,
        { personID, orderID },
      ]);
    }
  };

  return (
    <>
      <ul className="order-listing">
        {products.map((order: any) => (
          <li key={order._id}>
            <div className="order-box">
              <div className="d-flex align-items-center">
                <img
                  src={order.product_id?.images?.[0]}
                  className="img-fluid order-img"
                  alt=""
                />
                <div className="media-body">
                  <h4>{order.product_id.name}</h4>
                  <h5 className="content-color my-1">
                    By: {order.product_id.company}{" "}
                  </h5>
                  <h5 className="content-color my-1">Qty: {order.quantity}</h5>
                  {order.status_id <= 2 &&
                    userData.userType === "store" &&
                    storePersons && (
                      <>
                        <label htmlFor="assigned">Assigned person:</label>
                        <select
                          className="form-select"
                          onChange={(e) =>
                            addSelectedPerson(e.target.value, order._id)
                          }
                        >
                          <option value="">Select Person</option>
                          {storePersons.map((person: any) => (
                            <option
                              key={person._id}
                              value={person._id}
                              selected={person.user_id._id === order.assigned}
                            >
                              {person.user_id.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  {showBtn && (
                    <Link
                      className="theme-color"
                      to={`/order-tracking/${order.order_id}${
                        order.status_id >= 4 ? "/order/" + order._id : ""
                      }`}
                    >
                      View Details
                    </Link>
                  )}
                </div>
                <span
                  className={`status-label ${
                    [
                      "Order Canceled By Seller",
                      "Order Canceled By User",
                    ].includes(order.status)
                      ? "bg-danger"
                      : ""
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="delivery-status">
                {order.isReplacement && (
                  <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">
                    Replacement
                  </span>
                )}
                <div className="d-flex">
                  <div>
                    <h6 className="content-color">Ordered:</h6>
                    <h6>{order.created_at}</h6>
                  </div>
                  {order?.status === "Out for delivery" && order?.otp && (
                    <div>
                      <h6 className="content-color">OTP:</h6>
                      <h6>{order?.otp}</h6>
                    </div>
                  )}
                  <div>
                    <h6 className="content-color">Order ID:</h6>
                    <h6>{order?._id}</h6>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrderListing;
