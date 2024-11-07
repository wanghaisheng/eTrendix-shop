import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useUser } from "../../context/UserContext";
import "https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/Resell00448805757124.js";

// Declare Paytmpay globally
declare global {
  interface Window {
    Paytm: any;
  }
}

const Paytm = () => {
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
        "paytm"
      );

      if (response.status == 201) {
        const data = response.data;

        if (method == "COD") {
          navigate("/order-placed?receiptID=" + data.receipt);
        } else if (data.order.body.txnToken) {
          // Paytmpay initialization code
          const config = {
            flow: "DEFAULT",
            data: {
              orderId: data.orderID,
              token: data.order.body.txnToken,
              tokenType: "TXN_TOKEN",
              // amount: data.amount,
            },
            merchant: {
              name: "JL",
            },
            handler: {
              notifyMerchant: function (eventName: any, data: any) {
                console.log("Event Name: ", eventName);
                console.log("Data: ", data);
                if (eventName === "APP_CLOSED") {
                  navigate("/cart/" + pincodeID);
                }
              },
            },
          };

          const paytm = window.Paytm && window.Paytm.CheckoutJS;
          paytm.init(config).then(() => {
            paytm.invoke();
          });
        }
      }
      setLoader(false);
    } catch (error: any) {
      setLoader(false);
      console.log(error);
      setErrorString(error.response.data.message || "Something went wrong");
    }
  };

  return <> {loader && <Loader />}</>;
};

export default Paytm;
