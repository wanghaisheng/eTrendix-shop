import ReactSlickSlider from "react-slick";
import { useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import { useEffect, useState } from "react";
import { useBody } from "../../context/BodyContext";
import { Rating } from "react-simple-star-rating";
import Products from "../Products/Products";

const StorePage = () => {
  const { setHeaderName }: any = useBody();
  const { slug } = useParams();
  const [store, setStore] = useState<any>({});

  const fetchStore = async () => {
    try {
      const response = await UserService.fetchStore(slug || "");
      if (response.status === 200) {
        setStore(response.data);
        setHeaderName(["shop", response.data?.data?.shop_name]);

        calculateStoreRatingsReview(slug || "");
      }
    } catch (error) {}
  };

  const calculateStoreRatingsReview = async (slug: string) => {
    try {
      await UserService.calculateStoreRatingsReview(slug);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  var settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // centerMode: true,
    // centerPadding: "30px",
    dots: true,
    height: "300px",
  };

  return (
    <>
      <section className="product-page-section top-space pt-0">
        <div className="home-slider slick-default theme-dots ratio_asos overflow-hidden">
          {store.data?.images && store.data?.images.length > 1 ? (
            <ReactSlickSlider {...settings}>
              {store.data?.images.map((image: any, key: any) => (
                <div key={key}>
                  <div className="home-img">
                    <img src={image} className="img-fluid bg-img" alt="" />
                  </div>
                </div>
              ))}
            </ReactSlickSlider>
          ) : (
            store.data?.images && (
              <div className="home-img d-flex justify-content-center align-items-center">
                <img
                  src={store.data?.images[0]}
                  className="img-fluid bg-img"
                  alt=""
                />
              </div>
            )
          )}
        </div>

        <div className="product-detail-box px-15 pt-2">
          <div className="main-detail">
            <div className="row">
              <div className="col-7">
                <h2 className="text-capitalize">{store.data?.shop_name}</h2>
              </div>
              <div className="col-3">
                <div className="rating">
                  <Rating
                    initialValue={store.data?.average_rating}
                    allowFraction
                    readonly={true}
                    size={20}
                  />{" "}
                </div>
              </div>
              <div className="col-1">({store.data?.rating_count})</div>
            </div>

            <br />
            <h2>Address:</h2>
            <h3>
              {`${store.data?.address && store.data?.address + ","}  
            ${store.addressData?.Name && store.addressData?.Name + ","} 
            ${store.addressData?.City && store.addressData?.City + ","} 
            ${store.addressData?.State}`}
            </h3>
          </div>
        </div>
      </section>
      <div className="divider"></div>
      <div className="title-section px-15">
        <h2>Store Products</h2>
      </div>
      {store.data?._id && <Products opFilter={{ store_id: store.data?._id }} />}
    </>
  );
};

export default StorePage;
