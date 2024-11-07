import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import CategoryTitle from "./CategoryTitle";
import CategoryService from "../../services/CategoryService";
import { useBody } from "../../context/BodyContext";
import denimPNG from "../../assets/images/category/denim.png";
import skirtsPNG from "../../assets/images/category/skirts.png";
import flowerprintPNG from "../../assets/images/category/flowerprint.png";
import logo1PNG from "../../assets/images/brand-logos/1.png";
import logo2PNG from "../../assets/images/brand-logos/2.png";
import logo3PNG from "../../assets/images/brand-logos/3.png";
import logo4PNG from "../../assets/images/brand-logos/4.png";
import logo5PNG from "../../assets/images/brand-logos/5.png";
import logo6PNG from "../../assets/images/brand-logos/6.png";

const SubCategory = () => {
  const { setHeaderName }: any = useBody();
  const { category } = useParams();

  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories(category || "");
      if (response.status === 200) {
        setCategories(response.data);
        setHeaderName(["category", response.data.parentCategory?.name]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <>
      <CategoryTitle>{categories?.parentCategory?.name}</CategoryTitle>

      <section className="px-15 category-menu">
        <div className="accordion px-15">
          <div className="accordion-item">
            {categories?.data?.map((category: any, key: number) => {
              return (
                <Accordion defaultActiveKey="0" key={key}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>{category?.name}</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        {category.subCategory?.map((subCategory_value: any) => {
                          return (
                            <li key={subCategory_value._id}>
                              <Link
                                to={`/category/${category.slug}/${subCategory_value.slug}`}
                              >
                                {subCategory_value.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
            })}
          </div>
        </div>
      </section>

      <section className="inner-category px-15">
        <div className="row gx-3">
          <div className="col-4">
            <a href="shop.html">
              <img src={flowerprintPNG} className="img-fluid" alt="" />
              <h4>Flowerprint</h4>
            </a>
          </div>
          <div className="col-4">
            <a href="shop.html">
              <img src={denimPNG} className="img-fluid" alt="" />
              <h4>Denim</h4>
            </a>
          </div>
          <div className="col-4">
            <a href="shop.html">
              <img src={skirtsPNG} className="img-fluid" alt="" />
              <h4>Skirts</h4>
            </a>
          </div>
        </div>
      </section>

      <section className="brand-section px-15">
        <h2 className="title">Biggest Deals on Top Brands</h2>
        <div className="row g-3">
          <div className="col-4">
            <a className="brand-box" href="#">
              <img src={logo1PNG} className="img-fluid" alt="" />
            </a>
          </div>
          <div className="col-4">
            <a className="brand-box" href="#">
              <img src={logo2PNG} className="img-fluid" alt="" />
            </a>
          </div>
          <div className="col-4">
            <a className="brand-box" href="#">
              <img src={logo3PNG} className="img-fluid" alt="" />
            </a>
          </div>
          <div className="col-4">
            <a className="brand-box" href="#">
              <img src={logo4PNG} className="img-fluid" alt="" />
            </a>
          </div>
          <div className="col-4">
            <a className="brand-box" href="#">
              <img src={logo5PNG} className="img-fluid" alt="" />
            </a>
          </div>
          <div className="col-4">
            <a className="brand-box" href="#">
              <img src={logo6PNG} className="img-fluid" alt="" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default SubCategory;
