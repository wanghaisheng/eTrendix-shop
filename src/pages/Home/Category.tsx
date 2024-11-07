import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { Link } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState<any>([]);
  const [catLoader, setCatLoader] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setCatLoader(true);
    try {
      const response = await CategoryService.getHomeSliderCategory();

      if (response.status === 200) {
        setCategories(response.data);
      }
      setCatLoader(false);
    } catch (error) {
      setCatLoader(false);
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <section className="category-section top-space">
      <ul className="category-slide">
        {categories.map((category: any) => {
          return (
            <li className="me-6" key={category._id}>
              <Link to={"/category/" + category.slug} className="category-box">
                <img src={category.imageUrl} className="img-fluid" alt="" />
                <h6 className="text-truncate">{category.name}</h6>
              </Link>
            </li>
          );
        })}

        {catLoader && (
          <>
            <li className="me-6">
              <div className="placeholder-glow">
                <div
                  className="placeholder rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "60px", height: "60px" }}
                ></div>
              </div>
            </li>
            <li className="me-6">
              <div className="placeholder-glow">
                <div
                  className="placeholder rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "60px", height: "60px" }}
                ></div>
              </div>
            </li>
            <li className="me-6">
              <div className="placeholder-glow">
                <div
                  className="placeholder rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "60px", height: "60px" }}
                ></div>
              </div>
            </li>
            <li className="me-6">
              <div className="placeholder-glow">
                <div
                  className="placeholder rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "60px", height: "60px" }}
                ></div>
              </div>
            </li>
            <li className="me-6">
              <div className="placeholder-glow">
                <div
                  className="placeholder rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "60px", height: "60px" }}
                ></div>
              </div>
            </li>
            <li className="me-6">
              <div className="placeholder-glow">
                <div
                  className="placeholder rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "60px", height: "60px" }}
                ></div>
              </div>
            </li>
          </>
        )}
      </ul>
    </section>
  );
};

export default Category;
