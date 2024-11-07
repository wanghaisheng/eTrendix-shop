import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import userPNG from "../assets/images/user/2.png";
import { useState } from "react";

const ReviewList = ({ reviews, count, slug }: any) => {
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    const modalElement = document.getElementById("imageModal");
    if (modalElement) {
      modalElement.classList.add("show", "d-block");
      modalElement.setAttribute("aria-modal", "true");
      modalElement.removeAttribute("aria-hidden");
    }
  };

  const handleCloseModal = () => {
    const modalElement = document.getElementById("imageModal");
    if (modalElement) {
      modalElement.classList.remove("show", "d-block");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.removeAttribute("aria-modal");
    }
  };
  return (
    <div className="product-detail-box px-15">
      <h4 className="page-title">
        Customer Reviews ({count})
        {slug && reviews.length > 0 && (
          <Link to={`/product/${slug}/reviews`}>All Reviews</Link>
        )}
      </h4>
      <div className="review-section">
        <ul>
          {reviews?.map((review: any, key: any) => {
            return (
              <li key={key} className="row">
                <div className="media">
                  {/* change the user image */}
                  <img src={userPNG} className="img-fluid" alt="" />
                  <div className="media-body">
                    <h4>
                      {review?.user_id?.name || "Anonymous"} | {review?.date}
                    </h4>
                    <div className="ratings">
                      <Rating
                        initialValue={review?.productRating}
                        allowFraction
                        readonly={true}
                        size={15}
                      />
                    </div>
                  </div>
                </div>
                <h2>{review?.title}</h2>
                <h4 className="content-color">{review?.review}</h4>

                <div className="review-images mt-3">
                  <div className="row">
                    {review?.images?.map((image: string, index: number) => (
                      <div key={index} className="col-3">
                        <img
                          src={image}
                          className="img-fluid rounded"
                          alt={`Review image ${index + 1}`}
                          onClick={() => handleImageClick(image)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="review-bottom">
                  {/* <h6>
                        Size bought: <span className="content-color">S</span>
                      </h6> */}
                  {/* <div className="liking-sec">
                    <span className="content-color">
                      <img
                        src="/src/assets/svg/thumbs-up.svg"
                        className="img-fluid"
                        alt=""
                      />
                      20
                    </span>
                    <span className="content-color">
                      <img
                        src="/src/assets/svg/thumbs-down.svg"
                        className="img-fluid"
                        alt=""
                      />
                      2
                    </span>
                  </div> */}
                </div>
              </li>
            );
          })}

          {slug && reviews.length === 0 && (
            <li
              className="d-flex justify-content-center align-items-center w-100"
              style={{ height: "50px" }}
            >
              <div>No reviews</div>
            </li>
          )}
        </ul>
      </div>

      <div
        className="modal fade"
        id="imageModal"
        tabIndex={-1}
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="imageModalLabel">
                Image Preview
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={selectedImage}
                className="img-fluid"
                alt="Selected Review"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
