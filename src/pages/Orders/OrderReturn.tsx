import { useEffect, useState, useRef } from "react";
import UserService from "../../services/UserService";
import { useBody } from "../../context/BodyContext";
import { toast } from "react-toastify";
import OtpForm from "../../Components/OtpForm";
import ShippingDetails from "../../Components/ShippingDetails";
import SignatureCanvas from "react-signature-canvas";

const OrderReturn = () => {
  const order_id = new URLSearchParams(location.search).get("order_id");
  const token = new URLSearchParams(location.search).get("token");
  const [order, setOrder] = useState<any>({});
  const [images, setImages] = useState<string[]>([]);
  const [locationData, setLocationData] =
    useState<GeolocationCoordinates | null>(null);
  const [itemCondition, setItemCondition] = useState<string>("");
  const [signature, setSignature] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const { setHeaderName }: any = useBody();
  const [step, setStep] = useState("form");

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleProductSelection = (productId: string) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter((id) => id !== productId);
      } else {
        return [...prevSelectedProducts, productId];
      }
    });
  };

  const orderData = async () => {
    try {
      const response = await UserService.OrderReturnData({ order_id, token });
      if (response.data.status === "success") {
        const data = response.data;
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocationData(position.coords),
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    orderData();
    startCamera();
    setHeaderName(["Order Return/Replace"]);
    getLocation();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && images.length < 5) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = canvasRef.current.toDataURL("image/png");
        setImages((prevImages) => [...prevImages, imageData]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignature(null);
  };

  const saveSignature = () => {
    const signatureData = signatureRef.current?.toDataURL();
    setSignature(signatureData || null);
  };

  const handleNextStep = () => {
    if (!selectedProducts.length || !itemCondition || !images.length) {
      toast.error("Please ensure all required fields are filled.");
      return;
    }
    setStep("otp");
  };

  const otpSubmit = async (data: any) => {
    const Toastid = toast.loading("Please wait...");
    const otp = Object.values(data).join("");

    try {
      const data = {
        order_id,
        otp,
        selectedProducts, // Add selected products
        itemCondition, // Add item condition
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        signature, // Add signature
      };

      const response = await UserService.returnOrderSubmit(data);

      const responseData = response.data;

      if (responseData.status === "success") {
        for (let i = 0; i < images.length; i++) {
          const imageIndex = i + 1;
          const image = images[i];
          const uploadToastID = toast.loading(
            `Uploading image ${imageIndex} out of ${images.length}...`
          );

          // Upload image
          const uploadImage = await UserService.uploadReturnImage(
            {
              filetype: "image/jpeg",
              fileimage: image,
            },
            responseData.orderID
          );

          if (uploadImage.data.status == "success") {
            // Update toast message
            toast.update(uploadToastID, {
              render: `Image ${imageIndex} out of ${images.length} uploaded successfully.`,
              type: "success",
              isLoading: false,
              draggable: true,
              closeButton: true,
              autoClose: 5000,
            });
          } else {
            toast.update(uploadToastID, {
              render: uploadImage.data.message,
              type: "error",
              isLoading: false,
              draggable: true,
              closeButton: true,
              autoClose: 5000,
            });
          }
        }

        setStep("confirmed");
        toast.update(Toastid, {
          render: responseData.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(Toastid, {
          render: responseData.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error during OTP submission:", error);
      toast.update(Toastid, {
        render: error.response?.data.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleRejectItem = async () => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this item?"
    );
    if (confirmReject) {
      try {
        const response = await UserService.rejectOrder({ order_id, token });
        if (response.data.status === "success") {
          toast.success("Item has been successfully rejected.");
          setStep("rejected");
        } else {
          toast.error("Failed to reject the item.");
        }
      } catch (error) {
        console.error("Error rejecting the item:", error);
        toast.error("An error occurred while rejecting the item.");
      }
    }
  };

  return (
    <div className="top-space px-15">
      {step === "otp" && <OtpForm otpSubmit={otpSubmit} />}
      {step === "form" && (
        <>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Details</h5>
              <p className="card-text">
                <strong>Products:</strong> {order.product_id?.company}{" "}
                {order.orders?.map((orderItem: any) => (
                  <li key={orderItem.product_id._id}>
                    <input
                      type="checkbox"
                      onChange={() => handleProductSelection(orderItem._id)}
                    />{" "}
                    {orderItem.product_id.company} - {orderItem.product_id.name}
                  </li>
                ))}
              </p>
              <p className="card-text">
                <strong>Order ID:</strong> {order.orderData?.order_id}
              </p>
              <p className="card-text">
                <strong>Status:</strong>{" "}
                {
                  order.orderData?.statusLog[
                    order.orderData?.statusLog.length - 1
                  ].status
                }{" "}
                -{" "}
                {
                  order.orderData?.statusLog?.[
                    order.orderData?.statusLog?.length - 1
                  ]?.updated_at
                }
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <ShippingDetails order={order.orderData} />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Capture Images</h5>
              <div className="mb-3">
                <video
                  ref={videoRef}
                  autoPlay
                  className="img-thumbnail w-100 mb-3"
                ></video>
                <button
                  className="btn btn-primary"
                  onClick={captureImage}
                  disabled={images.length >= 5}
                >
                  Capture Image
                </button>
              </div>
              <div className="row">
                {images.map((image, index) => (
                  <div key={index} className="col-6 mb-3">
                    <div className="position-relative">
                      <img
                        src={image}
                        alt={`Captured ${index + 1}`}
                        className="img-thumbnail w-100"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                        style={{
                          transform: "translate(50%, -50%)",
                          borderRadius: "50%",
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Item Condition</h5>
              <select
                className="form-select"
                value={itemCondition}
                onChange={(e) => setItemCondition(e.target.value)}
              >
                <option value="">Select condition</option>
                <option value="Opened">Opened</option>
                <option value="Package Damage">Package Damage</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Damaged">Damaged</option>
                <option value="Sealed">Sealed</option>
                <option value="Defective">Defective</option>
                <option value="Expired">Expired</option>
                <option value="Wrong Item">Wrong Item</option>
                <option value="Missing Parts">Missing Parts</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {false && (
            <>
              <div className="card ">
                <div className="card-body">
                  <h5 className="card-title">Customer Signature</h5>
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                      width: 350,
                      height: 800,
                      className: "sigCanvas bg-light",
                    }}
                  />
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={saveSignature}
                  >
                    Save Signature
                  </button>
                  <button
                    className="btn btn-danger mt-2 ms-2"
                    onClick={clearSignature}
                  >
                    Clear Signature
                  </button>
                </div>
              </div>
            </>
          )}
          <canvas
            ref={canvasRef}
            className="d-none"
            width="640"
            height="480"
          ></canvas>
          <button
            className="btn btn-secondary mt-3"
            onClick={handleNextStep}
            type="button"
          >
            Submit
          </button>
          <button
            className="btn btn-danger mt-3 ms-2"
            type="button"
            onClick={() => handleRejectItem()}
          >
            Reject Item
          </button>
        </>
      )}

      {step == "confirmed" && <>Order Returned.</>}
    </div>
  );
};

export default OrderReturn;
