import { Rating } from "react-simple-star-rating";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserService from "../services/UserService";
import { toast } from "react-toastify";
import ImagesUpload from "./ImagesUpload";
import { useState } from "react";

const reviewSchema = z.object({
  order: z.string().nonempty({ message: "Product is required" }),
  productRating: z.number().min(1, { message: "Product rating is required" }),
  sellerRating: z.number().min(1, { message: "Seller rating is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  review: z.string().nonempty({ message: "Review is required" }),
});

const RateReviewForm = ({ orders, showRatingForm, setShowRatingForm }: any) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const onSubmit = async (data: any) => {
    setShowRatingForm(false);
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.postReview(data);
      if (response.status === 200) {
        toast.update(Toastid, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });

        for (let i = 0; i < selectedFiles.length; i++) {
          const imageIndex = i + 1;
          const image = selectedFiles[i];
          const uploadToastID = toast.loading(
            `Uploading image ${imageIndex} out of ${selectedFiles.length}...`
          );

          // Upload image
          const uploadImage = await UserService.uploadReviewImage(
            image,
            response.data.rating._id
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

        reset();
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
      } else {
        toast.update(Toastid, {
          render: "Something went wrong",
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
      <div
        className={"overlay-sidebar" + (showRatingForm ? " show" : "")}
        onClick={() => {
          setShowRatingForm(false);
        }}
      ></div>

      <div
        className={`offcanvas offcanvas-bottom h-auto ${
          showRatingForm ? "show" : ""
        }`}
        id="removecart"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Write review</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowRatingForm(false);
            }}
          ></button>
        </div>

        <div className="offcanvas-body small">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="order" className="form-label">
                Select an Order
              </label>
              <select
                className="form-select form-select-sm"
                aria-label=".form-select-sm example"
                {...register("order")}
              >
                {orders?.map((val: any) => (
                  <option key={val._id} value={val._id}>
                    {val.product_id?.company} {val.product_id?.name}
                  </option>
                ))}
              </select>
              {errors &&
                errors.product &&
                `<p className="text-danger">${errors?.product?.message}</p>`}
            </div>

            <div className="mb-3">
              <h6>Product Rating</h6>
              <Controller
                name="productRating"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Rating
                    {...field}
                    transition
                    showTooltip
                    onClick={(rate) => field.onChange(rate)}
                  />
                )}
              />
              {errors &&
                errors.productRating &&
                `<p className="text-danger">${errors?.productRating?.message}</p>`}
            </div>

            <div className="mb-3">
              <h6>Seller Rating</h6>
              <Controller
                name="sellerRating"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Rating
                    {...field}
                    transition
                    showTooltip
                    onClick={(rate) => field.onChange(rate)}
                  />
                )}
              />
              {errors &&
                errors.sellerRating &&
                `<p className="text-danger">${errors?.sellerRating?.message}</p>`}
            </div>

            <ImagesUpload
              titleText="Share photos of your product"
              setSelectedFiles={setSelectedFiles}
              selectedFiles={selectedFiles}
            />

            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                {...register("title")}
              />
              {errors &&
                errors.title &&
                `<p className="text-danger">${errors?.title?.message}</p>`}
            </div>
            <div className="mb-3 section-b-space">
              <label htmlFor="review" className="form-label">
                Review
              </label>
              <textarea
                className="form-control"
                id="review"
                rows={3}
                {...register("review")}
                required
              ></textarea>
              {errors &&
                errors.review &&
                `<p className="text-danger">${errors?.review?.message}</p>`}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RateReviewForm;
