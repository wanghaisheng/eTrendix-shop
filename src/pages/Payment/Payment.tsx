import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect } from "react";
import PayTmPNG from "../../assets/svg/payment/paytm-icon.png";

const Payment = () => {
  const pincodeID = new URLSearchParams(location.search).get("cart");
  const method = new URLSearchParams(location.search).get("method");

  const navigate = useNavigate();

  useEffect(() => {
    if (method === "COD") {
      navigate(`/razor-payment?cart=${pincodeID}&method=${method}`);
    }
  }, []);

  return (
    <div className="offer-section px-15 top-space">
      <section className="px-15 payment-method-section pt-0">
        <div className="accordion" id="accordionExample">
          <div className="card">
            <div className="card-header" id="h_one">
              <div
                className="btn btn-link"
                onClick={() =>
                  navigate(`/razor-payment?cart=${pincodeID}&method=${method}`)
                }
              >
                <label htmlFor="r_one">
                  <img
                    src="https://badges.razorpay.com/badge-dark.png"
                    className="img-fluid"
                    alt=""
                  />
                  RazorPay
                  <IoIosArrowForward />
                </label>
              </div>
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
            <div className="card-header" id="h_one">
              <div
                className="btn btn-link"
                onClick={() =>
                  navigate(`/paytm-payment?cart=${pincodeID}&method=${method}`)
                }
              >
                <label htmlFor="r_one">
                  <img src={PayTmPNG} className="img-fluid" alt="" />
                  PayTM
                  <IoIosArrowForward />
                </label>
              </div>
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
        </div>
      </section>
    </div>
  );
};

export default Payment;
