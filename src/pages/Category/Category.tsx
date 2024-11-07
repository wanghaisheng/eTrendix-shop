import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { Link } from "react-router-dom";
import saleGIF from "../../assets/images/sale.gif";
import salePNG from "../../assets/images/category/sale.png";

const Category = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.storeCategories();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="category-listing px-15 lg-space top-space pt-0">
      <a href="inner-category.html" className="category-wrap">
        <div className="content-part">
          <img src={saleGIF} className="img-fluid sale-gif" alt="" />
          <h4>upto 50% off on all products </h4>
        </div>
        <div className="img-part">
          <img src={salePNG} className="img-fluid" alt="" />
        </div>
      </a>
      {categories.map((category: any, key: number) => {
        return (
          <Link
            to={`/categories/${category.slug}`}
            className="category-wrap"
            key={key}
          >
            <div className="content-part">
              <h2>{category.name}</h2>
              {/* <h4>t-shirts, tops, bottoms..</h4> */}
            </div>
            {/* <div className="img-part">
              <img src={womenPNG} className="img-fluid" alt="" />
            </div> */}
          </Link>
        );
      })}
    </section>
  );
};

export default Category;
