import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import ImagesUpload from "../../Components/ImagesUpload";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface HelpSectionProps {
  status: number;
  showHelpSection: boolean;
  setShowHelpSection: (show: boolean) => void;
  orders: Array<{ _id: string; product_id: { company: string; name: string } }>;
  isReplacement: boolean;
}

const cancelSchema = z.object({
  order: z.string().min(1, { message: "Order is required" }),
  reason: z.string().min(1, { message: "Reason is required" }),
});

const returnSchema = z.object({
  order: z.string().min(1, { message: "Order is required" }),
  reason: z.string().min(1, { message: "Reason is required" }),
  productCondition: z
    .string()
    .min(1, { message: "Product condition is required" }),
});

const HelpSection = ({
  orders,
  status,
  showHelpSection,
  setShowHelpSection,
  isReplacement,
}: HelpSectionProps) => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState<
    "cancel" | "return" | "replace" | null
  >(null);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const {
    handleSubmit: handleCancelSubmit,
    register: cancelRegister,
    formState: { errors: cancelErrors },
  } = useForm({
    resolver: zodResolver(cancelSchema),
  });

  const {
    handleSubmit: handleReturnSubmit,
    register: returnRegister,
    formState: { errors: returnErrors },
  } = useForm({
    resolver: zodResolver(returnSchema),
  });

  const onCancelSubmit = async (data: any) => {
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.orderCancel(data);

      if (response.status === 200) {
        if (response.data.status == "success") {
          if (response.data.status == "success") {
            toast.update(Toastid, {
              render: response.data.message,
              type: "success",
              isLoading: false,
              draggable: true,
              closeButton: true,
              autoClose: 2000,
            });
          }
          navigate("/order-history", {
            state: {
              toastMessage: response.data.message,
              toastType: "success",
            },
          });
        }
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.update(Toastid, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 2000,
        });
      } else {
        toast.update(Toastid, {
          render: "something went wrong",
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 2000,
        });
      }
    }

    // Handle cancel form submission
  };

  const onReturnSubmit = async (data: any) => {
    const submitData = { ...data, type: formType };
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.orderReturn(submitData);

      if (response.status === 200) {
        if (response.data.status == "success") {
          if (response.data.status == "success") {
            toast.update(Toastid, {
              render: response.data.message,
              type: "success",
              isLoading: false,
              draggable: true,
              closeButton: true,
              autoClose: 2000,
            });
          }

          for (let i = 0; i < selectedFiles.length; i++) {
            const imageIndex = i + 1;
            const image = selectedFiles[i];
            const uploadToastID = toast.loading(
              `Uploading image ${imageIndex} out of ${selectedFiles.length}...`
            );

            // Upload image
            const uploadImage = await UserService.uploadReturnImage(
              image,
              data.order
            );

            if (uploadImage.data.status == "success") {
              // Update toast message
              toast.update(uploadToastID, {
                render: `Image ${imageIndex} out of ${selectedFiles.length} uploaded successfully.`,
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

          navigate("/order-history", {
            state: {
              toastMessage: response.data.message,
              toastType: "success",
            },
          });
        }
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.update(Toastid, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 2000,
        });
      } else {
        toast.update(Toastid, {
          render: "something went wrong",
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 2000,
        });
      }
    }
  };

  const renderForm = () => {
    if (formType === "replace" && status == 3) {
      return (
        <form onSubmit={handleReturnSubmit(onReturnSubmit)}>
          <div className="mb-3">
            <label htmlFor="order" className="form-label">
              Select an Order
            </label>
            <select
              id="order"
              className="form-select form-select-sm"
              {...returnRegister("order")}
              onChange={(e) => {
                setSelectedOrder(orders.find((o) => o._id === e.target.value));
              }}
            >
              <option value="">Please select</option>
              {orders?.map((val) => (
                <option key={val._id} value={val._id}>
                  {val.product_id?.company} {val.product_id?.name}
                </option>
              ))}
            </select>
            {returnErrors.order && (
              <p className="text-danger">
                {JSON.stringify(returnErrors.order.message)}
              </p>
            )}
          </div>
          {selectedOrder && !selectedOrder?.inventoryData?.isReplaceable && (
            <div className="alert alert-warning" role="alert">
              Product is not replaceble. Please contact the product's service
              centre for any product related issue.
            </div>
          )}

          {selectedOrder &&
            selectedOrder?.inventoryData?.isReplaceable &&
            selectedOrder.daysPassed >
              selectedOrder?.inventoryData?.replacement_days && (
              <div className="alert alert-warning" role="alert">
                The replace window is closed.
              </div>
            )}
          {selectedOrder &&
            selectedOrder?.inventoryData?.isReplaceable &&
            selectedOrder.daysPassed <
              selectedOrder?.inventoryData?.replacement_days && (
              <>
                <ImagesUpload
                  titleText="Share photos of your product"
                  setSelectedFiles={setSelectedFiles}
                  selectedFiles={selectedFiles}
                />

                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">
                    Reason for Return
                  </label>
                  <textarea
                    id="reason"
                    className="form-control"
                    {...returnRegister("reason")}
                  />
                  {returnErrors.reason && (
                    <p className="text-danger">
                      {JSON.stringify(returnErrors.reason.message)}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="productCondition" className="form-label">
                    Product Condition
                  </label>
                  <input
                    type="text"
                    id="productCondition"
                    className="form-control"
                    {...returnRegister("productCondition")}
                  />
                  {returnErrors.productCondition && (
                    <p className="text-danger">
                      {JSON.stringify(returnErrors.productCondition.message)}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Submit Return
                </button>
              </>
            )}
        </form>
      );
    } else if (formType === "return" && status == 3) {
      return (
        <form onSubmit={handleReturnSubmit(onReturnSubmit)}>
          <div className="mb-3">
            <label htmlFor="order" className="form-label">
              Select an Order
            </label>
            <select
              id="order"
              className="form-select form-select-sm"
              {...returnRegister("order")}
              onChange={(e) => {
                setSelectedOrder(orders.find((o) => o._id === e.target.value));
              }}
            >
              <option value="">Please select</option>
              {orders?.map((val) => (
                <option key={val._id} value={val._id}>
                  {val.product_id?.company} {val.product_id?.name}
                </option>
              ))}
            </select>
            {returnErrors.order && (
              <p className="text-danger">
                {JSON.stringify(returnErrors.order.message)}
              </p>
            )}
          </div>
          {selectedOrder && !selectedOrder?.inventoryData?.isReturn && (
            <div className="alert alert-warning" role="alert">
              Product is not returnable. Please contact the product's service
              centre for any product related issue.
            </div>
          )}

          {selectedOrder &&
            selectedOrder?.inventoryData?.isReturn &&
            selectedOrder.daysPassed >
              selectedOrder?.inventoryData?.replacement_days && (
              <div className="alert alert-warning" role="alert">
                The return window is closed.
              </div>
            )}

          {selectedOrder &&
            selectedOrder?.inventoryData?.isReturn &&
            selectedOrder.daysPassed <
              selectedOrder?.inventoryData?.replacement_days && (
              <>
                <ImagesUpload
                  titleText="Share photos of your product"
                  setSelectedFiles={setSelectedFiles}
                  selectedFiles={selectedFiles}
                />

                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">
                    Reason for Return
                  </label>
                  <textarea
                    id="reason"
                    className="form-control"
                    {...returnRegister("reason")}
                  />
                  {returnErrors.reason && (
                    <p className="text-danger">
                      {JSON.stringify(returnErrors.reason.message)}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="productCondition" className="form-label">
                    Product Condition
                  </label>
                  <input
                    type="text"
                    id="productCondition"
                    className="form-control"
                    {...returnRegister("productCondition")}
                  />
                  {returnErrors.productCondition && (
                    <p className="text-danger">
                      {JSON.stringify(returnErrors.productCondition.message)}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Submit Return
                </button>
              </>
            )}
        </form>
      );
    } else if (
      formType === "cancel" &&
      status >= 0 &&
      status <= 2 &&
      !isReplacement
    ) {
      return (
        <form onSubmit={handleCancelSubmit(onCancelSubmit)}>
          <div className="mb-3">
            <label htmlFor="order" className="form-label">
              Select an Order
            </label>
            <select
              id="order"
              className="form-select form-select-sm"
              {...cancelRegister("order")}
            >
              {orders?.map((val) => (
                <option key={val._id} value={val._id}>
                  {val.product_id?.company} {val.product_id?.name}
                </option>
              ))}
            </select>
            {cancelErrors.order && (
              <p className="text-danger">
                {JSON.stringify(cancelErrors.order.message)}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="reason" className="form-label">
              Reason for Cancellation
            </label>
            <textarea
              id="reason"
              className="form-control"
              {...cancelRegister("reason")}
            />
            {cancelErrors.reason && (
              <p className="text-danger">
                {JSON.stringify(cancelErrors.reason.message)}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Cancellation
          </button>
        </form>
      );
    }
    return null;
  };

  return (
    <>
      <div
        className={"overlay-sidebar" + (showHelpSection ? " show" : "")}
        onClick={() => {
          setShowHelpSection(false);
        }}
      ></div>
      <div
        className={`offcanvas offcanvas-bottom h-auto ${
          showHelpSection ? "show" : ""
        }`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Need Help with your product?</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowHelpSection(false);
            }}
          ></button>
        </div>

        <div className="offcanvas-body small">
          <div className="mb-3">
            {status >= 0 && status <= 2 && !isReplacement && (
              <button
                type="button"
                className={`btn ${
                  formType === "cancel" ? "btn-primary" : "btn-outline-primary"
                } w-100 mb-2`}
                onClick={() => setFormType("cancel")}
              >
                Cancel Order
              </button>
            )}
            {status == 3 && (
              <button
                type="button"
                className={`btn ${
                  formType === "return" ? "btn-primary" : "btn-outline-primary"
                }  w-100 mb-2`}
                onClick={() => setFormType("return")}
              >
                Return Order
              </button>
            )}

            {status == 3 && (
              <button
                type="button"
                className={`btn ${
                  formType === "replace" ? "btn-primary" : "btn-outline-primary"
                } w-100`}
                onClick={() => setFormType("replace")}
              >
                Replace Order
              </button>
            )}
          </div>

          {renderForm()}
        </div>
      </div>
    </>
  );
};

export default HelpSection;
