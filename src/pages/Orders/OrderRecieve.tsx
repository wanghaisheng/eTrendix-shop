import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ShippingDetails from "../../Components/ShippingDetails";
import { toast } from "react-toastify";
import OrderListing from "./OrderListing";
import PriceDetails from "../../Components/PriceDetails";
import circleGIF from "../../assets/images/check-circle.gif";

const schema = z.object({
  digit1: z.number(),
  digit2: z.number(),
  digit3: z.number(),
  digit4: z.number(),
  digit5: z.number(),
  digit6: z.number(),
});

type otpForm = z.infer<typeof schema>;

const OrderRecieve = () => {
  const order_id = new URLSearchParams(location.search).get("order_id");
  const token = new URLSearchParams(location.search).get("token");

  const [order, setOrder] = useState<any>({});
  // const [otpError, setotpError] = useState("");
  const [confirm, setConfirm] = useState(false);

  const orderData = async () => {
    try {
      const response = await UserService.OrderRecieve({ order_id, token });
      if (response.data.status == "success") {
        const data = response.data;
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // navigate("/");
    }
  };

  useEffect(() => {
    orderData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<otpForm>({ resolver: zodResolver(schema) });

  const handleInput = (e: any) => {
    const input = e.target;
    const maxLength = parseInt(input.getAttribute("maxlength"), 10);
    const currentLength = input.value.length;

    if (currentLength >= maxLength) {
      const nextInput = input.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const otpSubmit = async (data: any) => {
    const Toastid = toast.loading("Please wait...");
    // Submit the form
    const otp = Object.values(data).join("");
    try {
      const response = await UserService.OrderConfirm(order_id, otp); // Perform form submission logic here
      const data = response.data;

      if (data.status == "success") {
        setConfirm(true);
        toast.update(Toastid, {
          render: data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
      } else {
        toast.update(Toastid, {
          render: data.message,
          type: "error",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.update(Toastid, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <>
      {confirm && (
        <section className="order-success-section px-15 top-space xl-space">
          <div>
            <img src={circleGIF} className="img-fluid" alt="" />
            <h1>Delivered successfully!</h1>
          </div>
        </section>
      )}
      {!confirm && (
        <div className="form-section px-15 top-space section-b-space">
          <div className="offcanvas-body">
            <h4>Code Verification:</h4>
            <h2 className="content-color fw-normal mb-2">
              Enter your verification code here:
            </h2>
            <h2 className="fw-normal me-2">
              {/* <a className="title-color" href="#">
          <i className="iconly-Edit icli"></i>
        </a> */}
            </h2>
            {(errors.digit1 ||
              errors.digit2 ||
              errors.digit3 ||
              errors.digit4 ||
              errors.digit5 ||
              errors.digit6) && (
              <p className="text-danger">Please enter valid OTP.</p>
            )}

            {/* {otpError && <p className="text-danger">{otpError}</p>} */}
            <form
              onSubmit={handleSubmit((data) => {
                otpSubmit(data);
              })}
            >
              <div className="input-otp-form my-3">
                <input
                  {...register("digit1", { valueAsNumber: true })}
                  className="form-control"
                  maxLength={1}
                  type="text"
                  onInput={(e) => handleInput(e)}
                />
                <input
                  {...register("digit2", { valueAsNumber: true })}
                  className="form-control"
                  maxLength={1}
                  type="text"
                  onInput={(e) => handleInput(e)}
                />
                <input
                  {...register("digit3", { valueAsNumber: true })}
                  className="form-control"
                  maxLength={1}
                  type="text"
                  onInput={(e) => handleInput(e)}
                />
                <input
                  {...register("digit4", { valueAsNumber: true })}
                  className="form-control"
                  maxLength={1}
                  type="text"
                  onInput={(e) => handleInput(e)}
                />

                <input
                  {...register("digit5", { valueAsNumber: true })}
                  className="form-control"
                  maxLength={1}
                  type="text"
                  onInput={(e) => handleInput(e)}
                />

                <input
                  {...register("digit6", { valueAsNumber: true })}
                  className="form-control"
                  maxLength={1}
                  type="text"
                  onInput={(e) => handleInput(e)}
                />
              </div>
              <button
                className="btn btn-solid w-100"
                data-bs-dismiss="offcanvas"
                type="submit"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      )}
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
      <section className="px-15">
        {order.orders && (
          <OrderListing products={order?.orders} showBtn={false} />
        )}
      </section>
      <div className="divider"></div>

      <div className="px-15 section-b-space">
        <h6 className="tracking-title content-color">Price Details</h6>
        <PriceDetails order={order} />
      </div>
    </>
  );
};

export default OrderRecieve;
