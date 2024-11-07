import { useEffect, useState } from "react";
import "https://checkout.razorpay.com/v1/checkout.js";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useUser } from "../../context/UserContext";

// Declare Razorpay globally
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Razor = () => {
  const { setErrorString } = useUser();
  const [loader, setLoader] = useState(false);
  const pincodeID = new URLSearchParams(location.search).get("cart");
  const method = new URLSearchParams(location.search).get("method");

  const navigate = useNavigate();
  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    setLoader(true);

    try {
      const response = await UserService.createOrder(
        pincodeID,
        method || "",
        "razor"
      );

      if (response.status == 201) {
        const data = response.data;
        if (method == "COD") {
          navigate("/order-placed?receiptID=" + data.receipt);
        } else if (data.orderID) {
          // Razorpay initialization code
          if (window.Razorpay) {
            var options = {
              name: "etrendix",
              description: "Product Payment",
              image: "https://etrendix.netlify.app/src/assets/images/logo.png",
              order_id: data.orderID,
              handler: function (response: any) {
                UserService.paymentProcess(response).then(() => {
                  navigate("/order-placed?receiptID=" + data.receipt);
                });
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature);
              },
              prefill: {
                name: data.address.name,
                contact: data.address.phone,
              },
              notes: {
                address: data.address.address,
              },
              theme: {
                color: "#3399cc",
              },
              modal: {
                confirm_close: true,
                ondismiss: function () {
                  navigate("/cart/" + pincodeID);
                },
              },

              timeout: 600,
            };
            var rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
              console.log(response.error);
              console.log(response.error.code);
              console.log(response.error.description);
              console.log(response.error.source);
              console.log(response.error.step);
              console.log(response.error.reason);
              console.log(response.error.metadata.order_id);
              console.log(response.error.metadata.payment_id);
            });
            rzp1.open();
          }
        }
      }
      setLoader(false);
    } catch (error: any) {
      setLoader(false);
      setErrorString(error.response.data.message || "Something went wrong");
    }
  };

  return <> {loader && <Loader />}</>;
};

export default Razor;
