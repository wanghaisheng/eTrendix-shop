import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";
import ProductService from "../../services/ProductService";
import { useBody } from "../../context/BodyContext";
import { useUser } from "../../context/UserContext";

const ProductListing = ({ filter, setFilter }: any) => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true); // New loading state

  const endMessages = [
    "Oops! You've reached the end of the list. Time to go outside and get some fresh air!",
    "That's all, folks! No more products here. Maybe it's time to take a break?",
    "You've seen it all! No more products left. How about a coffee break?",
    "End of the line! You’re officially a browsing champion!",
    "Nothing more to see here! How about checking back later for new stuff?",
    "Congratulations! You've reached the end. Maybe it's time to treat yourself to a snack?",
    "No more products left. Time to switch to shopping mode!",
    "You've reached the end of the list. How about a virtual high-five?",
    "That’s it for now! Check back later for more awesome products.",
    "All done! You've seen everything. Time to plan your next adventure!",
  ];

  const { setHeaderName }: any = useBody();
  const { userData }: any = useUser();

  const [hasMore, setHasMore] = useState(true);
  const [endMessage, setEndMessage] = useState("");

  useEffect(() => {
    if (filter.isWishlist !== true) {
      setLoading(true);
      if (filter.reset) {
        setProducts([]);
        setHasMore(true);
      }

      fetchProducts();
    }
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getProducts(filter);
      if (response.status === 200) {
        setLoading(false);
        if (response.data.categoryName != "") {
          setHeaderName(["category", response.data.categoryName]);
        }

        if (response.data.subCategoryName != "") {
          setHeaderName([
            "category",
            response.data.categoryName,
            response.data.subCategoryName,
          ]);
        }
        const newProducts = response.data.products?.data || [];
        if (newProducts.length === 0) {
          setHasMore(false);
          setEndMessage(
            endMessages[Math.floor(Math.random() * endMessages.length)]
          );
        } else {
          setProducts((prevProducts: any) => [...prevProducts, ...newProducts]);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const loadMoreProducts = () => {
    setFilter({ ...filter, reset: false });

    setFilter((prevFilter: any) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };

  const [wishlistStatus, setWishlistStatus] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleWishlist = (productId: number) => {
    setWishlistStatus((prevStatus) => ({
      ...prevStatus,
      [productId]: !prevStatus[productId],
    }));
  };

  const addToWishlist = async (productId: number) => {
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.addToWishlist(productId);

      if (response.status === 200) {
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

  const getWishlistProductIDs = async () => {
    try {
      const response = await UserService.getWishlistProductIDs();

      if (response.status === 200) {
        const productIDs = response.data.productIDs;

        if (filter.isWishlist) {
          setFilter({
            ...filter,
            isWishlist: productIDs,
          });
        }

        const status = productIDs.reduce(
          (acc: { [key: number]: boolean }, id: number) => {
            acc[id] = true;
            return acc;
          },
          {}
        );
        setWishlistStatus(status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData.phone) {
      getWishlistProductIDs();
    }
  }, []);

  return (
    <section className="px-15 lg-t-space">
      <div className="row gy-3 gx-3">
        {products.map((product: any, key: number) => {
          var image = "/src/assets/images/products/1.jpg";

          if (product.images.length > 0) {
            image = product.images[0];
          }

          const isActive = wishlistStatus[product._id];

          return (
            <div className="col-6" key={key}>
              <div className="product-box ratio_square">
                <div className="img-part">
                  <Link
                    to={`/product/${product.slug}${
                      filter.store_id != "" ? "?shop=" + filter.store_id : ""
                    }`}
                  >
                    <img src={image} alt="" className="img-fluid" />
                  </Link>
                  <div
                    className={`wishlist-btn ${
                      isActive ? "animate active" : "inactive"
                    }`}
                    onClick={() => {
                      toggleWishlist(product._id);
                      addToWishlist(product._id);
                    }}
                  >
                    <i className="iconly-Heart icli"></i>
                    <i className="iconly-Heart icbo"></i>
                    <div className="effect-group">
                      <span className="effect"></span>
                      <span className="effect"></span>
                      <span className="effect"></span>
                      <span className="effect"></span>
                      <span className="effect"></span>
                    </div>
                  </div>
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
                  <Link
                    to={`/product/${product.slug}${
                      filter.store_id != "" ? "?shop=" + filter.store_id : ""
                    }`}
                  >
                    <h4>{`${product.company} ${product.name}`}</h4>
                  </Link>
                  <div className="price">
                    <h4>
                      {product.price && product?.total_stockQuantity > 0 ? (
                        `₹${product.price}`
                      ) : (
                        <span className="text-danger">
                          Currently out of stock
                        </span>
                      )}
                      {/* <del>$35.00</del> */}
                      {/* <span>20%</span> */}
                    </h4>
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

      {products &&
        products.length > 0 &&
        products.length == filter.limitPerPage && (
          <>
            {hasMore ? (
              <ul className="pt-5  ">
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
                <p>{endMessage}</p>
              </div>
            )}
          </>
        )}
    </section>
  );
};

export default ProductListing;
