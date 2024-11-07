import { useEffect, useState } from "react";
import ReactSlickSlider from "react-slick";
import ProductService from "../../services/ProductService";
import { useParams } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useBody } from "../../context/BodyContext";
import { useUser } from "../../context/UserContext";
import { Alert, Card, Placeholder } from "react-bootstrap";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";
import DOMPurify from "dompurify";
import { Rating } from "react-simple-star-rating";
import ReviewList from "../../Components/ReviewList";
import PincodeSearch from "../../Components/PincodeSearch";
import deliverySVG from "../../assets/svg/delivery.svg";
import paymentSVG from "../../assets/svg/payment.svg";
import refundSVG from "../../assets/svg/refund.svg";
import minusSVG from "../../assets/svg/minus-square.svg";
import plusSVG from "../../assets/svg/plus-square.svg";
import { GrInstall } from "react-icons/gr";
import { MdOutlineHomeRepairService } from "react-icons/md";

const Product = () => {
  const storeId = new URLSearchParams(location.search).get("shop");

  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [loaderShopCard, setLoaderShopCard] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);

  const { setHeaderName, setShowLoginForm }: any = useBody();
  const { selectedLocation, fetchCartCount, userData } = useUser();

  // const [selectedArea, setSelectedArea] = useState({});
  const [selectedShop, setSelectedShop] = useState<any>({});
  const [shopsData, setShopsData] = useState<any>([]);

  const { slug } = useParams();

  const handleIncrement = () => {
    setQuantity((prevQuantity: number) => {
      // Ensure quantity does not exceed stock quantity
      if (prevQuantity < selectedShop.stockQuantity) {
        return prevQuantity + 1;
      } else {
        return prevQuantity; // Return the same value if max quantity is reached
      }
    });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity: number) => prevQuantity - 1);
    }
  };

  var settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "30px",
    dots: true,
    arrows: false,
    height: "300px",
  };

  useEffect(() => {
    setHeaderName(["Product"]);
    setLoader(true);
    const { req, cancel } = ProductService.getProduct(slug || "");

    req
      .then((res) => {
        const data = res.data;
        if (data.status === "success") {
          setProduct(data.data);

          // console.log(product.info);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });

    return () => cancel();
  }, []);

  useEffect(() => {
    setHeaderName(["Product"]);
    if (product.slug) {
      calculateRatingsReview();
    }
    if (selectedLocation._id && product._id) {
      setLoaderShopCard(true);

      const { req, cancel } = ProductService.checkDelivery(
        product._id,
        selectedLocation._id
      );

      req
        .then((response) => {
          const data = response.data;
          setLoaderShopCard(false);
          setShopsData(data);
          if (storeId == null) {
            setSelectedShop(data[0]);
          } else {
            if (response.data.length > 0) {
              setSelectedShop(
                response.data.find((shop: any) => shop.user._id == storeId)
              );
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          setLoaderShopCard(false);
        })
        .finally(() => {
          setLoaderShopCard(false);
        });
      return () => cancel();
    }
  }, [product, selectedLocation]);

  const calculateRatingsReview = async () => {
    try {
      await ProductService.calculateRatingsReview(product.slug);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    if (selectedShop._id == undefined) {
      toast.error("No seller available for selected location.");
      return;
    }

    if (selectedShop.stockQuantity == 0) {
      toast.error("Out of stock,Please select another store.");
      return;
    }

    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.addToCart(
        selectedShop._id,
        quantity,
        product._id,
        selectedLocation._id
      );
      if (response.status === 200) {
        const data = response.data;
        // console.log(data);
        toast.update(Toastid, {
          render: data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
        fetchCartCount();
        setQuantity(1);
      }
    } catch (error: any) {
      // console.log(error);
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

  const sanitizeAndTransformDescription = (description: any) => {
    const sanitizedHTML = DOMPurify.sanitize(description);
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedHTML, "text/html");
    const images = doc.querySelectorAll("img");
    images.forEach((img) => img.classList.add("img-fluid"));
    return doc.body.innerHTML;
  };

  const addToWishlist = async () => {
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.addToWishlist(product._id);

      if (response.status === 200) {
        if (response.data.code == 1) {
          setIsWishlist(false);
        } else if (response.data.code == 2) {
          setIsWishlist(true);
        }

        toast.update(Toastid, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 2000,
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
          autoClose: 2000,
        });
      }
    }
  };

  const getWishlistProductID = async () => {
    try {
      const response = await UserService.getWishlistProductID(product._id);
      if (response.status === 200) {
        setIsWishlist(response.data.isWishlist);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (product._id != undefined && userData.phone) {
      getWishlistProductID();
    }
  }, [product]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedShop]);

  return (
    <>
      {loader && <Loader />}
      <section className="product-page-section top-space pt-0">
        <div className="home-slider slick-default theme-dots ratio_asos overflow-hidden">
          {product.images && product.images.length > 1 ? (
            <ReactSlickSlider {...settings}>
              {product.images.map((image: any, key: any) => (
                <div key={key}>
                  <div className="home-img">
                    <img src={image} className="img-fluid bg-img" alt="" />
                  </div>
                </div>
              ))}
            </ReactSlickSlider>
          ) : (
            product.images && (
              <div className="home-img d-flex justify-content-center align-items-center">
                <img
                  src={product.images[0]}
                  className="img-fluid bg-img"
                  alt=""
                />
              </div>
            )
          )}
        </div>
        <div className="product-detail-box px-15 pt-2">
          <div className="main-detail">
            <h2 className="text-capitalize">{product.name}</h2>
            <h4>By {product.company}</h4>
            {/* <h6 className="content-color">
              Black, off-white and peach-coloured printed flared skirt, has zip
              closure, attached lining
            </h6> */}
            <div className="rating-section">
              <div className="rating">
                <Rating
                  initialValue={product.average_rating}
                  allowFraction
                  readonly={true}
                  size={20}
                />
              </div>

              <h6 className="content-color">
                ({product.rating_count} ratings)
              </h6>
            </div>
            <div className="price">
              <h3>
                ₹ {selectedShop?.price ? selectedShop.price : "Not Available"}
              </h3>
            </div>
            <h6 className="text-green">inclusive of all taxes</h6>
            {selectedShop?.user?.shop_name && (
              <p>
                <span>(Sold by {selectedShop?.user?.shop_name})</span>
              </p>
            )}
          </div>
        </div>
        <div className="divider"></div>
        <div className="check-delivery-section product-detail-box px-15">
          <div className="title-section">
            <h4>Check Delivery</h4>
            <h6 className="content-color">
              Enter Pincode to check delivery date / pickup option
            </h6>
          </div>
          <PincodeSearch />
          {loaderShopCard && (
            <Card>
              <div className="placeholder-content">
                <div className="placeholder-wave">
                  <div
                    className="placeholder bg-secondary"
                    style={{ width: "100%", height: "300px" }}
                  ></div>
                </div>
              </div>
              <Card.Body>
                {/* <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder> */}
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                  <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                  <Placeholder xs={8} />
                </Placeholder>
              </Card.Body>
            </Card>
          )}
          {!loaderShopCard &&
            shopsData.length > 0 &&
            shopsData.map((shop: any, index: any) => {
              if (storeId != null && shop.user._id != storeId) return null;

              return (
                <Card
                  className=" mb-3"
                  key={index}
                  onClick={() => setSelectedShop(shop)}
                >
                  <Card.Body>
                    <Card.Title>
                      {shop.stockQuantity == 0 && (
                        <div className="text-danger mt-1">Out of stock</div>
                      )}
                    </Card.Title>
                    <Card.Text>{shop.user.about}</Card.Text>
                    <div className="service-section">
                      <ul>
                        {shop.deliveryMessage != "" && (
                          <li>
                            <img
                              src={deliverySVG}
                              className="img-fluid"
                              alt=""
                            />
                            {shop.deliveryMessage}
                          </li>
                        )}

                        {shop.installation ? (
                          <li>
                            <MdOutlineHomeRepairService className="me-2" />{" "}
                            Installation Available
                          </li>
                        ) : (
                          <li>
                            <GrInstall className="me-2" /> Open Box Delivery
                          </li>
                        )}

                        {shop.cod == "1" && (
                          <li>
                            <img
                              src={paymentSVG}
                              className="img-fluid"
                              alt=""
                            />
                            `` Cash On delivery Available
                          </li>
                        )}
                        {(shop.isReplaceable || shop.isReturn) &&
                        shop.replacement_days > 0 ? (
                          <>
                            <li>
                              <img
                                src={refundSVG}
                                className="img-fluid"
                                alt=""
                              />
                              {shop.replacement_days} days{" "}
                              {shop.isReplaceable && "replace"}
                              {shop.isReplaceable && shop.isReturn && "/"}
                              {shop.isReturn && "return"} by the seller
                            </li>
                            {shop.returnPolicy && (
                              <li>Return Policy: {shop.returnPolicy}</li>
                            )}
                          </>
                        ) : (
                          <li>
                            <img src={refundSVG} className="img-fluid" alt="" />
                            This product is not eligible for return or exchange
                          </li>
                        )}

                        {shop.offer && <li>Shop Offer: {shop.offer}</li>}
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

          {selectedLocation.pincode && shopsData.length == 0 && (
            <Alert variant="info">
              Sorry, Product is not available on your selected location
            </Alert>
          )}
        </div>
        <div className="divider"></div>
        <div className="product-detail-box px-15">
          <div className="size-detail"></div>

          <div className="size-detail">
            <h4 className="size-title">Quantity:</h4>
            <div className="qty-counter">
              <div className="input-group">
                <button
                  type="button"
                  className="btn quantity-left-minus"
                  onClick={handleDecrement}
                >
                  <img src={minusSVG} className="img-fluid" alt="" />
                </button>
                <input
                  type="text"
                  name="quantity"
                  className="form-control form-theme qty-input input-number"
                  value={quantity}
                  readOnly
                />
                <button
                  type="button"
                  className="btn quantity-right-plus"
                  onClick={handleIncrement}
                >
                  <img src={plusSVG} className="img-fluid" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>
        <div className="product-detail-box px-15">
          <h4 className="page-title">Return & Exchange Policy</h4>
          <h4 className="content-color">
            Returns and replacements are managed directly by the seller and may
            not be available for all products, particularly if the product is
            delivered using an open box delivery. Please check the seller’s
            return and replacement policy on the Terms and Conditions Page. If
            eligible, you can initiate a request from the 'My Orders' section in
            the App within eligible days of delivery. Ensure that the product is
            in its original condition with all tags attached.
          </h4>
        </div>
        <div className="divider"></div>
        <div className="product-detail-box px-15">
          <h4 className="page-title mb-1">Product Details</h4>

          <div className="product-detail-box">
            {product.description && (
              <h4
                className="content-color mb-3"
                dangerouslySetInnerHTML={{
                  __html: sanitizeAndTransformDescription(
                    product?.description || ""
                  ),
                }}
              ></h4>
            )}
          </div>

          {product?.info &&
            product?.info?.map((value: any, key: any) => {
              return (
                <div key={key}>
                  <h4 className="page-title mb-1">{value.label}</h4>
                  <h4 className="content-color mb-3">{value.value}</h4>
                </div>
              );
            })}
        </div>
        <div className="divider"></div>

        <ReviewList
          reviews={product.lastReviews}
          count={product?.rating_count}
          slug={product?.slug}
        />
      </section>

      <div className="fixed-panel">
        <div className="row">
          <div className="col-6">
            <a
              href="#0"
              className="theme-color"
              onClick={() => {
                userData.phone ? addToCart() : setShowLoginForm(true);
              }}
            >
              <i className="iconly-Buy icli"></i>ADD TO CART
            </a>
          </div>
          <div className="col-6">
            <a
              href="#0"
              onClick={() => {
                userData.phone ? addToWishlist() : setShowLoginForm(true);
              }}
            >
              <i
                className={
                  isWishlist ? "iconly-Heart icbo" : "iconly-Heart icli"
                }
              ></i>
              {isWishlist ? "REMOVE" : "ADD TO WISHLIST"}
            </a>
          </div>
        </div>
      </div>

      <section className="panel-space"></section>
    </>
  );
};

export default Product;
