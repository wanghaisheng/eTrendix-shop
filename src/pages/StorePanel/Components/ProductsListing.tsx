import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import SellerService from "../../../services/SellerService";
import { Modal, Button } from "react-bootstrap";

const schema = z.object({
  price: z.number().min(1),
  basePrice: z.number().min(1),
  replacement_days: z.number().optional(),
  cod: z.boolean(),
  offer: z.string().optional(),
  stockQuantity: z.number().min(0),
  warrantyPeriod: z.number().min(0),
  returnPolicy: z.string().optional(),
  returnAccepted: z.boolean().optional(),
  replaceAccepted: z.boolean().optional(),
  installation: z.boolean().optional(),
  gstPercentage: z.number().min(0),
});

const ProductsListing = ({
  products,
  loading,
  hasMore,
  setFilter,
  filter,
}: any) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  // const [showMessage, setShowMessage] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const basePrice = watch("basePrice");
  const gstPercentage = watch("gstPercentage");

  useEffect(() => {
    if (basePrice && gstPercentage >= 0) {
      const gstAmount = (basePrice * gstPercentage) / 100;
      setValue("price", (basePrice + gstAmount).toFixed(2));
    }
  }, [basePrice, gstPercentage, setValue]);

  useEffect(() => {
    setValue("replacement_days", 0);
  }, []);

  useEffect(() => {
    // Set default values when the selectedProduct changes
    console.log(selectedProduct);
    setValue("price", selectedProduct?.price || "");
    setValue("basePrice", selectedProduct?.basePrice || "");
    setValue("replacement_days", selectedProduct?.replacement_days || 0);
    setValue("cod", selectedProduct?.cod != "0" ? true : false);
    setValue("returnAccepted", selectedProduct?.isReturn);
    setValue("replaceAccepted", selectedProduct?.isReplaceable);
    setValue("installation", selectedProduct?.installation);
    setValue("offer", selectedProduct?.offer || "");
    setValue("returnPolicy", selectedProduct?.returnPolicy || "");
    setValue("stockQuantity", selectedProduct?.stockQuantity || "");
    setValue("warrantyPeriod", selectedProduct?.warrantyPeriod || "");
    setValue("gstPercentage", selectedProduct?.gstPercentage || "");
  }, [selectedProduct, setValue]);

  const returnAccepted = watch("returnAccepted");
  const replaceAccepted = watch("replaceAccepted");
  const installationChecked = watch("installation");

  const loadMoreProducts = () => {
    setFilter({ ...filter, reset: false });
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };

  const onSubmit = async (data: any) => {
    const ToastID = toast.loading("Please wait...");
    const submittedData = {
      ...data,
      product_id: selectedProduct.product
        ? selectedProduct.product._id
        : selectedProduct._id,
      cod: data.cod ? 1 : 0,
      isReturn: data.returnAccepted,
      isReplaceable: data.replaceAccepted,
    };

    try {
      const response = await SellerService.AddToInventory(submittedData);
      if (response.status === 200 || response.status === 201) {
        setFilter({ ...filter });
        reset();
        setSelectedProduct({});

        setVisibleModal(false);

        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.update(ToastID, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      } else {
        toast.update(ToastID, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      }
    }
  };

  const removeInventory = async (productId: string) => {
    const ToastID = toast.loading("Please wait...");

    try {
      const response = await SellerService.removeInventory(productId);

      if (response.status === 200) {
        setFilter({ ...filter });

        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      const message = error.response
        ? error.response.data.message
        : "Something went wrong";
      console.log(message);
      toast.update(ToastID, {
        render: message,
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
    }
  };
  return (
    <section className="px-15 lg-t-space">
      <div className="row gy-3 gx-3">
        {products?.map((productData: any, key: number) => {
          const product = productData.product || productData;
          const btnName = productData.product ? "Edit" : "Add";
          var image = "/src/assets/images/products/1.jpg";

          if (product?.images?.length > 0) {
            image = product.images[0];
          }

          return (
            <div className="col-6" key={key}>
              <div className="product-box ratio_square">
                <div className="img-part">
                  <Link to={`/product/${product.slug}`}>
                    <img src={image} alt="" className="img-fluid" />
                  </Link>
                </div>
                <div className="product-content">
                  <div className="ratings">
                    <Rating
                      initialValue={product?.average_rating}
                      allowFraction
                      readonly={true}
                      size={15}
                    />{" "}
                    <h6>({product?.rating_count})</h6>
                  </div>
                  <Link to={`/product/${product.slug}`}>
                    <h4>{`${product.company} ${product.name}`}</h4>
                  </Link>
                  <h5>
                    {product.category.name}
                    {">"}
                    {product.subCategory.name}
                  </h5>
                  <div className="price d-flex justify-content-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setVisibleModal(true);
                        setSelectedProduct(productData);
                      }}
                    >
                      {btnName}
                    </button>

                    {productData.product && (
                      <button
                        className="btn btn-outline-danger mx-1"
                        onClick={() => {
                          if (window.confirm("Delete the item?")) {
                            removeInventory(productData.product._id);
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="col-6" key={index}>
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <div className="placeholder-glow">
                      <div
                        className="placeholder bg-secondary"
                        style={{ width: "100%", height: "200px" }}
                      ></div>
                    </div>
                  </div>
                  <div className="product-content">
                    <div className="placeholder-glow">
                      <span className="placeholder col-6 bg-secondary"></span>
                      <span className="placeholder col-8 bg-secondary mt-2"></span>
                      <span className="placeholder col-4 bg-secondary mt-2"></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {products && products.length > 0 && (
        <>
          {hasMore ? (
            <ul className="pt-5">
              <li className="d-block">
                <button
                  type="button"
                  className="w-100 btn btn-outline"
                  onClick={loadMoreProducts}
                >
                  Load More
                </button>
              </li>
            </ul>
          ) : (
            <div className="end-message text-center pt-5">
              <p>No more results found</p>
            </div>
          )}
        </>
      )}

      {/* Bootstrap Modal */}
      <Modal
        show={visibleModal}
        onHide={() => setVisibleModal(false)}
        fullscreen={true}
      >
        <Modal.Header>
          <a onClick={() => setVisibleModal(false)} className="back-btn">
            <i className="iconly-Arrow-Left icli"></i>
          </a>
          <div className="mx-2">
            {`${
              selectedProduct.product
                ? selectedProduct?.product?.company
                : selectedProduct?.company
            } - ${
              selectedProduct.product
                ? selectedProduct?.product?.name
                : selectedProduct?.name
            }`}
          </div>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="price">Base Price:</label>
                {errors.basePrice && (
                  <span className="text-danger">
                    {String(errors.basePrice.message)}
                  </span>
                )}
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">₹</span>
                  </div>
                  <input
                    {...register("basePrice", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="basePrice"
                  />
                </div>
              </div>
              {/* GST Type Selection */}

              {/* GST Percentage */}
              <div className="form-group">
                <label htmlFor="gstPercentage">GST Percentage:</label>
                {errors.gstPercentage && (
                  <span className="text-danger">
                    {String(errors.gstPercentage.message)}
                  </span>
                )}
                <div className="input-group mb-3">
                  <input
                    {...register("gstPercentage", { valueAsNumber: true })}
                    type="number"
                    className="form-control"
                    id="gstPercentage"
                    placeholder="Enter GST %"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="price">Final Price:</label>
                {errors.price && (
                  <span className="text-danger">
                    {String(errors.price.message)}
                  </span>
                )}
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">₹</span>
                  </div>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    className="form-control"
                    id="price"
                    disabled={true}
                  />
                </div>
              </div>

              {/* Stock Quantity */}
              <div className="form-group">
                <label htmlFor="stockQuantity">Stock Quantity:</label>
                {errors.stockQuantity && (
                  <span className="text-danger">
                    {String(errors.stockQuantity.message)}
                  </span>
                )}
                <input
                  {...register("stockQuantity", { valueAsNumber: true })}
                  type="number"
                  className="form-control"
                  id="stockQuantity"
                />
              </div>

              {/* Warranty Period */}
              <div className="form-group mb-2">
                <label htmlFor="warrantyPeriod">
                  Warranty Period (in days):
                </label>
                {errors.warrantyPeriod && (
                  <span className="text-danger">
                    {String(errors.warrantyPeriod.message)}
                  </span>
                )}
                <input
                  {...register("warrantyPeriod", { valueAsNumber: true })}
                  type="number"
                  className="form-control"
                  id="warrantyPeriod"
                />
              </div>

              {/* Additional fields, similar error handling */}
              {/* Return Accepted */}
              <div className="form-group">
                <div className="form-check mb-3">
                  <input
                    {...register("installation")}
                    type="checkbox"
                    className="form-check-input"
                    id="installation"
                  />
                  <label className="form-check-label" htmlFor="installation">
                    Installation Available
                  </label>
                </div>
                {installationChecked && (
                  <div className="alert alert-info">
                    <strong>Note:</strong> Since installation is available, the
                    product is not eligible for the open box policy. The
                    installation professional sent by the seller will open the
                    box and install the product. The seller is responsible for
                    coordinating the installation service.
                  </div>
                )}

                <div className="form-check mb-3">
                  <input
                    {...register("returnAccepted")}
                    type="checkbox"
                    className="form-check-input"
                    id="returnAccepted"
                  />
                  <label className="form-check-label" htmlFor="returnAccepted">
                    Return Accepted
                  </label>
                </div>

                {/* Replace Accepted */}
                <div className="form-check mb-3">
                  <input
                    {...register("replaceAccepted")}
                    type="checkbox"
                    className="form-check-input"
                    id="replaceAccepted"
                  />
                  <label className="form-check-label" htmlFor="replaceAccepted">
                    Replace Accepted
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    {...register("cod")}
                    type="checkbox"
                    className="form-check-input"
                    id="cod"
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash On Delivery
                  </label>
                </div>
              </div>

              {/* Return/Replacement Days */}
              {(returnAccepted || replaceAccepted) && (
                <>
                  <div className="form-group">
                    <label htmlFor="returnPolicy">
                      Return/Replacement Policy:
                    </label>
                    <input
                      {...register("returnPolicy")}
                      type="text"
                      className="form-control"
                      id="returnPolicy"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="replacement_days">
                      Return/Replacement Days:
                    </label>
                    {errors.replacement_days && (
                      <span className="text-danger">
                        {String(errors.replacement_days.message)}
                      </span>
                    )}
                    <input
                      {...register("replacement_days", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      className="form-control"
                      id="replacement_days"
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisibleModal(false)}>
            Close
          </Button>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit(onSubmit)}
          >
            Save changes
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ProductsListing;
