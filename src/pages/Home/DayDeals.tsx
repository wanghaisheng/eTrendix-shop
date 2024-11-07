import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

const DayDeals = () => {
  const [products, setProducts] = useState<any>();

  useEffect(() => {
    fetchBestSeller();
  }, []);

  const fetchBestSeller = async () => {
    try {
      const response = await ProductService.getBestSeller();
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {}
  };

  return (
    <section className="deals-section px-15 pt-1">
      <div className="title-part">
        <h2>Best selling</h2>
        {/* <a href="shop.html">See All</a> */}
      </div>
      <div className="product-section">
        <div className="row gy-3">
          {products?.map((product: any, key: number) => {
            var image = "/src/assets/images/products/1.jpg";

            if (product.images.length > 0) {
              image = product.images[0];
            }

            return (
              <div className="col-12" key={key}>
                <div className="product-inline">
                  <Link to={`/product/${product.slug}`}>
                    <img src={image} className="img-fluid mb-3" alt="" />
                  </Link>
                  <div className="product-inline-content">
                    <div>
                      <Link to={`/product/${product.slug}`}>
                        <h4>{product.name}</h4>
                      </Link>
                      <h5>by {product.company}</h5>
                      <div className="price">
                        <h4>
                          ₹{product.price}
                          {/* <span>20%</span> */}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <Rating
                    initialValue={product?.average_rating}
                    allowFraction
                    readonly={true}
                    size={15}
                    className="mt-2"
                  />
                  <h6>({product?.rating_count})</h6>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DayDeals;
