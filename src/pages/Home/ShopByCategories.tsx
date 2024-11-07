import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { Link } from "react-router-dom";

const ShopByCategories = () => {
  const [categories, setCategories] = useState<any>([]);
  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await CategoryService.getMainCategory();

      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <section className="offer-corner-section px-15">
      <h2 className="title">Top Categories</h2>
      <div className="row g-3">
        {categories.map((category: any) => {
          return (
            <div className="col-6" key={category._id}>
              <div className="offer-box">
                <img src={category.imageUrl} className="img-fluid" alt="" />
                <Link to={"/category/" + category.slug}>{category.name}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategories;
