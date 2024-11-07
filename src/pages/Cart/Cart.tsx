import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RiUserLocationLine } from "react-icons/ri";
import truckGIF from "../../assets/images/truck.gif";
import minusSVG from "../../assets/svg/minus-square.svg";
import plusSVG from "../../assets/svg/plus-square.svg";
import payment1 from "../../assets/images/payment/1.png";
import payment2 from "../../assets/images/payment/2.png";
import payment4 from "../../assets/images/payment/4.png";
import { useUser } from "../../context/UserContext";

interface selectedProduct {
  _id: string;
  quantity: number;
  inventory: {
    stockQuantity: number;
  };
}

const Cart = () => {
  const { fetchCartCount } = useUser();
  const [cartData, setCartData] = useState<any>([]);
  const [bagPrice, setbagPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [showRemoveCart, setShowRemoveCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<selectedProduct>();
  const { pincodeID } = useParams();
  const [isCOD, setIsCOD] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("UPI");
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    fetchCart(pincodeID);
  }, []);

  const fetchCart = async (pincodeID: any) => {
    try {
      const response = await UserService.getCart(pincodeID);

      if (response.status === 200) {
        setCartData(response.data);

        // let totalPrice = 0;
        let bagtotal = 0;
        let deliveryCharge = 0;
        response.data.cart.forEach((product: any) => {
          setIsCOD(product.inventory.cod);
          bagtotal +=
            parseFloat(product.inventory.price) * parseInt(product.quantity);
        });

        response.data.deliveryCharge.forEach((charge: any) => {
          deliveryCharge += parseFloat(charge.deliveryCharge);
        });
        setbagPrice(bagtotal);
        setDeliveryPrice(deliveryCharge);
        setTotalPrice(bagtotal + deliveryCharge);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const removeProductDB = () => {
    const Toastid = toast.loading("Please wait...");
    UserService.removeProductCart(selectedProduct?._id)
      .then((res) => {
        const data = res.data;

        toast.update(Toastid, {
          render: data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });

        setShowRemoveCart(false);
        fetchCart(pincodeID);
        fetchCartCount();
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
          setShowRemoveCart(false);
          fetchCart(pincodeID);
        }
      });
  };

  const updateQuantity = async () => {
    const Toastid = toast.loading("Please wait...");

    try {
      if (
        selectedProduct &&
        quantity <= selectedProduct.inventory.stockQuantity
      ) {
        const response = await UserService.updateCartQuantity(
          selectedProduct._id,
          quantity
        );

        if (response.status === 200) {
          toast.update(Toastid, {
            render: "Quantity updated successfully",
            type: "success",
            isLoading: false,
            draggable: true, // Make the toast draggable
            closeButton: true, // Show close button
            autoClose: 5000,
          });
          fetchCart(pincodeID);
          setShowQuantityModal(false);
        }
      } else {
        toast.update(Toastid, {
          render: "Please reduce the quantity",
          type: "error",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.update(Toastid, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        draggable: true, // Make the toast draggable
        closeButton: true, // Show close button
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <div
        className={"overlay-sidebar" + (showRemoveCart ? " show" : "")}
        onClick={() => {
          setShowRemoveCart(false);
        }}
      ></div>
      {/* cart items start */}
      <section className="cart-section pt-0 top-space xl-space">
        <div
          className={
            cartData.commonPincodes?.includes(
              cartData.selectedAddress?.pincode_id
            ) ||
            cartData.commonCities?.includes(
              cartData.selectedAddressPincode?.pincode.slice(0, 3)
            )
              ? "alert alert-light d-flex align-items-center"
              : "alert alert-danger d-flex align-items-center"
          }
          role="alert"
        >
          <RiUserLocationLine />
          {/* <div>{` ${cartData.pincode?.Name} (${cartData.pincode?.pincode})`}</div> */}
          <div>
            {`${cartData.selectedAddress?.address} ${cartData.selectedAddressPincode?.City}, ${cartData.selectedAddressPincode?.State}`}
            ,{cartData.selectedAddressPincode?.pincode}
          </div>
          {!cartData.commonPincodes?.includes(
            cartData.selectedAddress?.pincode_id
          ) &&
            !cartData.commonCities?.includes(
              cartData.selectedAddressPincode?.pincode.slice(0, 3)
            ) && <span className="text-danger">(Not Deliverable)</span>}

          <Link to={`/addresses?cart=${pincodeID}`} className="btn btn-light">
            Change
          </Link>
        </div>

        {cartData &&
          cartData.cart?.map((product: any, index: any) => (
            <div key={index}>
              <div className="cart-box px-15">
                <Link
                  to={"/product/" + product.product.slug}
                  className="cart-img"
                >
                  <img
                    src={product.product.images && product.product.images[0]}
                    className="img-fluid"
                    alt=""
                  />
                </Link>
                <div className="cart-content">
                  <Link to={"/product/" + product.product.slug}>
                    <h4>{product.product.name}</h4>
                  </Link>

                  <h5 className="content-color my-1">
                    By: {product.product.company}{" "}
                  </h5>

                  <h5 className="content-color">
                    {product.inventory?.cod && (
                      <span className="badge rounded-pill bg-light text-dark">
                        COD available
                      </span>
                    )}
                  </h5>
                  <div className="price">
                    <h4>
                      ₹ {product.inventory.price}
                      {/* <span>20%</span> */}
                    </h4>
                  </div>
                  <div className="select-size-sec">
                    <a
                      className={`opion ${
                        product.quantity > product.inventory.stockQuantity &&
                        `border border-danger`
                      }`}
                      onClick={() => {
                        setShowQuantityModal(true);
                        setSelectedProduct(product);
                        setQuantity(product.quantity);
                      }}
                    >
                      <h6>Qty: {product.quantity}</h6>

                      <i className="iconly-Arrow-Down-2 icli"></i>
                    </a>
                    {product.inventory.stockQuantity != 0 &&
                      product.quantity > product.inventory.stockQuantity && (
                        <div className="text-danger mt-1">
                          Only {product.inventory.stockQuantity} left in stock.
                          Please reduce the quantity.
                        </div>
                      )}

                    {product.inventory.stockQuantity == 0 && (
                      <div className="text-danger mt-1">Out of stock</div>
                    )}
                  </div>
                  <div className="cart-option">
                    {/* <h5 data-bs-toggle="offcanvas" data-bs-target="#removecart">
                      <i className="iconly-Heart icli"></i> Move to wishlist
                    </h5>
                    <span className="divider-cls">|</span> */}
                    <h5
                      onClick={() => {
                        setShowRemoveCart(true);
                        setSelectedProduct(product);
                      }}
                    >
                      <i className="iconly-Delete icli"></i>
                      Remove
                    </h5>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </div>
          ))}
      </section>

      <section className="px-15 payment-method-section pt-0">
        <div className="accordion" id="accordionExample">
          <div className="card">
            <div className="card">
              <div className="card-header" id="h_four">
                <div className="btn btn-link">
                  <label htmlFor="r_four">
                    <img src={payment4} className="img-fluid" alt="" />
                    UPI/Net Banking
                    <input
                      type="radio"
                      className="radio_animated"
                      id="r_four"
                      name="occupation"
                      value="UPI"
                      defaultChecked={true}
                      required
                      onClick={() => setSelectedPaymentMethod("UPI")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div
              className={`card-header ${!isCOD && "border border-danger"}`}
              id="h_one"
            >
              <div className="btn btn-link">
                <label htmlFor="r_one">
                  <img src={payment1} className="img-fluid" alt="" />
                  Cash On Delivery
                  <input
                    type="radio"
                    className="radio_animated"
                    id="r_one"
                    name="occupation"
                    value="COD"
                    disabled={!isCOD}
                    required
                    onClick={() => setSelectedPaymentMethod("COD")}
                  />
                </label>
              </div>
              {!isCOD && (
                <h5 className="text-danger">
                  Cash on Delivery is unavailable because one or more items in
                  your cart don't support this payment option.
                </h5>
              )}
            </div>
            <div
              id="one"
              className="collapse show"
              aria-labelledby="h_one"
              data-bs-parent="#accordionExample"
            >
              <div className="card-body p-0"></div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" id="h_two">
              <div className="btn btn-link">
                <label htmlFor="r_two">
                  <img src={payment2} className="img-fluid" alt="" />
                  Debit/Credit Card
                  <input
                    type="radio"
                    className="radio_animated"
                    id="r_two"
                    name="occupation"
                    value="Card"
                    required
                    onClick={() => setSelectedPaymentMethod("CARD")}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="divider"></div>
      {/* cart items end */}

      {/* coupon section */}
      {/* <section className="px-15 pt-0">
        <h2 className="title">Coupons:</h2>
        <div className="coupon-section">
          <i className="iconly-Discount icli icon-discount"></i>
          <input
            className="form-control form-theme"
            placeholder="Apply Coupons"
          />
          <i className="iconly-Arrow-Right-2 icli icon-right"></i>
        </div>
      </section>
      <div className="divider"></div> */}
      {/* coupon end */}

      {/* order details start */}
      <section id="order-details" className="px-15 pt-0">
        <h2 className="title">Order Details:</h2>
        <div className="order-details">
          <ul>
            <li>
              <h4>
                Bag total <span>₹ {bagPrice.toFixed(2)}</span>
              </h4>
            </li>
            {/* <li>
              <h4>
                Bag savings <span className="text-green">-$20.00</span>
              </h4>
            </li>
            <li>
              <h4>
                Coupon Discount{" "}
                <a href="coupons.html" className="theme-color">
                  Apply Coupon
                </a>
              </h4>
            </li> */}
            {cartData?.deliveryCharge?.map((value: any, key: any) => {
              return (
                <li key={key}>
                  <h4>
                    Delivery charges by {value.storeName}
                    <span>₹{value.deliveryCharge}</span>
                  </h4>
                </li>
              );
            })}

            <li>
              <h4>
                Coupon Discount{" "}
                <a href="coupons.html" className="theme-color">
                  Apply Coupon
                </a>
              </h4>
            </li>
          </ul>
          <div className="total-amount">
            <h4>
              Total Amount <span>₹ {totalPrice.toFixed(2)}</span>
            </h4>
          </div>
          {deliveryPrice == 0 && (
            <div className="delivery-info">
              <img src={truckGIF} className="img-fluid" alt="" />
              <h4>No Delivery Charges applied on this order </h4>
            </div>
          )}
        </div>
      </section>
      <div className="divider"></div>

      {/* order details end */}

      {/* service section start */}
      {/* <section className="service-wrapper px-15 pt-0">
        <div className="row">
          <div className="col-4">
            <div className="service-wrap">
              <div className="icon-box">
                <img
                  src="/src/assets/svg/returning.svg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <span>7 Day Return</span>
            </div>
          </div>
          <div className="col-4">
            <div className="service-wrap">
              <div className="icon-box">
                <img
                  src="/src/assets/svg/24-hours.svg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <span>24/7 Support</span>
            </div>
          </div>
          <div className="col-4">
            <div className="service-wrap">
              <div className="icon-box">
                <img
                  src="/src/assets/svg/wallet.svg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </section> */}
      {/* service section end */}

      {/* panel space start */}
      <section className="panel-space"></section>
      {/* panel space end */}

      {/* bottom panel start */}
      <div className="cart-bottom">
        <div>
          <div className="left-content">
            <h4>₹ {totalPrice.toFixed(2)}</h4>
            <a href="#order-details" className="theme-color">
              View details
            </a>
          </div>
          <Link
            to={`/payment?cart=${pincodeID}&method=${selectedPaymentMethod}`}
            className="btn btn-solid"
          >
            PAY
          </Link>
        </div>
      </div>
      {/* bottom panel end */}

      {/* select qty offcanvas start */}

      <div
        className={"overlay-sidebar" + (showQuantityModal && " show")}
        onClick={() => {
          setShowQuantityModal(false);
        }}
      ></div>

      <div
        className={`offcanvas offcanvas-bottom h-auto qty-canvas ${
          showQuantityModal && "show"
        }`}
        id="selectQty"
      >
        {selectedProduct && (
          <div className="offcanvas-body small">
            <h4>Select Quanity:</h4>
            <div className="qty-counter">
              <div className="input-group">
                <button
                  type="button"
                  className="btn quantity-left-minus"
                  data-type="minus"
                  data-field=""
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  <img src={minusSVG} className="img-fluid" alt="" />
                </button>
                <input
                  type="text"
                  name="quantity"
                  className="form-control form-theme qty-input input-number"
                  value={quantity} // Use controlled input
                  readOnly
                />
                <button
                  type="button"
                  className="btn quantity-right-plus"
                  data-type="plus"
                  data-field=""
                  onClick={() => {
                    if (quantity < selectedProduct.inventory.stockQuantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  <img src={plusSVG} className="img-fluid" alt="" />
                </button>
              </div>
            </div>
            <a
              onClick={() => {
                updateQuantity();
              }}
              className="btn btn-solid w-100"
              data-bs-dismiss="offcanvas"
            >
              UPDATE
            </a>
          </div>
        )}
      </div>
      {/* select qty offcanvas end */}

      {/* remove item canvas start */}
      <div
        className={`offcanvas offcanvas-bottom h-auto removecart-canvas ${
          showRemoveCart && "show"
        } `}
        id="removecart"
      >
        <div className="offcanvas-body small">
          <div className="content">
            <h4>Remove Item:</h4>
            <p>
              Are you sure you want to remove or move this item from the cart?
            </p>
          </div>
          <div className="bottom-cart-panel">
            <div className="row">
              <div className="col-7">
                <a href="wishlist.html" className="title-color">
                  MOVE TO WISHLIST
                </a>
              </div>
              <div className="col-5">
                <a href="#0" className="theme-color" onClick={removeProductDB}>
                  REMOVE
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* remove item canvas end */}

      {/*  */}
    </>
  );
};

export default Cart;
