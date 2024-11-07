import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import UserService from "../../services/UserService";
import { Link } from "react-router-dom";
import emptyCartImage from "../../assets/images/empty-cart.png";
import { useUser } from "../../context/UserContext";

const SelectCart = ({ showCart, setShowCart }: any) => {
  const { fetchCartCount } = useUser();
  const [cartData, setCartData] = useState<any>();
  const [cartLoader, setCartLoader] = useState(false);
  useEffect(() => {
    if (showCart) {
      fetchCartGroup();
    }
  }, [showCart]);

  const fetchCartGroup = async () => {
    setCartLoader(true);
    try {
      const response = await UserService.fetchCartGroup();
      if (response.status === 200) {
        setCartData(response.data.data);
        setCartLoader(false);
        fetchCartCount();
      }
    } catch (error) {
      setCartLoader(false);
    }
  };

  const removeCart = async (id: string) => {
    setCartLoader(true);
    try {
      const response = await UserService.removeCart(id);
      if (response.status === 200) {
        fetchCartGroup();
        fetchCartCount();
      }

      setCartLoader(false);
    } catch (error) {
      setCartLoader(false);
      console.log(error);
    }
  };

  return (
    <>
      <div
        className={"overlay-sidebar" + (showCart ? " show" : "")}
        onClick={() => {
          setShowCart(false);
        }}
      ></div>

      <div
        className={`offcanvas offcanvas-bottom h-auto ${showCart && "show"} `}
        id="removecart"
      >
        <div className="offcanvas-header">
          Carts
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowCart(false);
            }}
          ></button>
        </div>

        <div className="offcanvas-body small">
          {cartLoader && (
            <div className="card">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h5 className="card-title">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12">Loading</span>
                    </p>
                  </h5>
                  <div className="card-text">
                    <div className="placeholder-glow">
                      <span className="placeholder col-12">Loading</span>
                    </div>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="btn btn-solid disabled placeholder-glow"
                  >
                    View Cart
                  </a>
                  <a
                    href="#"
                    className="btn btn-danger disabled placeholder-glow"
                  >
                    <RxCross2 />
                  </a>
                </div>
              </div>
            </div>
          )}
          {!cartLoader && cartData?.length === 0 && (
            <div className="empty-cart-section text-center">
              <img src={emptyCartImage} className="img-fluid" alt="" />
              <h2>Whoops !! Cart is Empty</h2>
              <p>
                Looks like you haven't added anything to your cart yet. You will
                find a lot of interesting products on our “Shop” page
              </p>
              <Link
                to="/"
                className="btn btn-solid w-100"
                onClick={() => {
                  setShowCart(false);
                }}
              >
                start shopping
              </Link>
            </div>
          )}
          {!cartLoader &&
            cartData?.map((cart: any, key: any) => {
              return (
                <div className="card mb-1" key={key}>
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{`${
                        cart.pincode?.Name ? cart.pincode?.Name + "," : ""
                      } ${cart.pincode?.Street ? cart.pincode?.Street : ""} (${
                        cart.pincode?.pincode
                      })`}</h5>
                      <p className="card-text">{cart?.count} Products</p>
                    </div>
                    <div className="button-group d-flex">
                      <Link
                        to={`cart/${cart.pincode._id}`}
                        className="btn btn-solid mx-1"
                      >
                        View Cart
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          removeCart(cart.pincode._id);
                        }}
                      >
                        <RxCross2 />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default SelectCart;
