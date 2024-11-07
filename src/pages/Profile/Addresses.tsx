import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";
import { useUser } from "../../context/UserContext";

const Addresses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedLocation } = useUser();

  const { toastMessage, toastType } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const pincodeID = new URLSearchParams(location.search).get("cart");

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState<any>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  useEffect(() => {
    if (toastMessage && toastType) {
      // Display toast message
      toast.success(toastMessage);
    }
  }, [toastMessage, toastType]);

  useEffect(() => {
    const { req, cancel } = UserService.savedAddresses();

    req.then((res) => {
      const data = res.data;
      setAddresses(data);
    });
    return () => cancel();
  }, []);

  useEffect(() => {
    if (pincodeID != null) {
      fetchCart(pincodeID);
    }
  }, [pincodeID]);

  const fetchCart = async (pincodeID: string) => {
    try {
      const response = await UserService.getCart(pincodeID);

      if (response.status === 200) {
        setCart(response.data);
        let totalPrice = 0;
        response.data.cart.forEach((product: any) => {
          totalPrice +=
            parseFloat(product.store.price) * parseInt(product.quantity);
        });
        // if (totalPrice == 0) {
        //   navigate("/empty-cart");
        // }
        setTotalPrice(totalPrice);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const updateDefault = (id: number) => {
    const Toastid = toast.loading("Please wait...");
    UserService.updateDefaultAddress(id)
      .then((res) => {
        const data = res.data;

        setSelectedLocation(data.pincodeData);

        toast.update(Toastid, {
          render: data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 1000,
        });
      })
      .catch((error) => {
        if (error.response.data.message) {
          toast.update(Toastid, {
            render: error.response.data.message,
            type: "error",
            isLoading: false,
            draggable: true, // Make the toast draggable
            closeButton: true, // Show close button
            autoClose: 5000,
          });
          // setShowRemoveCart(false);
        }
      });
  };

  const processOrder = () => {
    if (selectedAddress == null) {
      toast.error("Please select an address for delivery");
    } else {
      navigate("/cart/" + pincodeID);
    }
  };

  return (
    <>
      <section className="top-space px-15">
        <div className="delivery-option-section">
          <label htmlFor="addresses">Saved Addresses</label>
          <ul>
            {addresses &&
              addresses.map((address: any, index: any) => (
                <li
                  key={index}
                  // className={
                  //   !cart.commonPincodes?.includes(address.pincode_id._id) &&
                  //   pincodeID == "" &&
                  //   `border border-danger`
                  // }
                >
                  <div className="check-box active">
                    <div className="form-check d-flex ps-0">
                      <div className="col-1">
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          <input
                            className="radio_animated"
                            defaultChecked={
                              address.default && pincodeID == null
                            }
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            onClick={() => {
                              setSelectedAddress(address._id);
                              updateDefault(address._id);
                            }}
                            disabled={
                              !cart.commonPincodes?.includes(
                                address.pincode_id._id
                              ) && pincodeID != null
                            }
                          />
                        </label>
                      </div>
                      <div className="col-6">
                        <h4 className="name">
                          {address.name}{" "}
                          {!cart.commonPincodes?.includes(
                            address.pincode_id._id
                          ) &&
                            pincodeID != null && (
                              <span className="text-danger">
                                (Not Deliverable)
                              </span>
                            )}
                        </h4>
                        <div className="addess">
                          <h4>{address.address}</h4>
                          <h4>
                            {address.pincode_id?.City},{" "}
                            {address.pincode_id?.State}
                          </h4>
                          <h4>{address.pincode_id?.pincode}</h4>
                        </div>
                        <h4>Phone No: {address?.phone}</h4>
                        {/* {address.pincode_id._id} */}
                        <h6 className="label text-uppercase">
                          {address.addressType}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="buttons">
                    <a href="#">Remove</a>
                    <a href="#">edit</a>
                  </div>
                </li>
              ))}
          </ul>
          <Link
            to="/addresses/select-location"
            className="btn btn-outline text-capitalize w-100 mt-3"
          >
            add New address
          </Link>
        </div>
      </section>
      <div className="divider"></div>

      {pincodeID != null && (
        <>
          <div className="delivery-cart cart-bottom">
            <div>
              <div className="left-content">
                <h4>₹ {totalPrice.toFixed(2)}</h4>
                <a
                  href="#0"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasdetails"
                  className="theme-color"
                >
                  View details
                </a>
              </div>
              <button className="btn btn-solid" onClick={processOrder}>
                SAVE
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Addresses;
