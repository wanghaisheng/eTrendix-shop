import { useEffect, useState } from "react";
import HomeService from "../../services/HomeService";
import intoIMG from "../../assets/images/introduction.jpg";
import usersSVG from "../../assets/svg/about/users.svg";
import storesSVG from "../../assets/svg/about/stores.svg";
import deliverySVG from "../../assets/svg/about/delivery.svg";
import diamondSVG from "../../assets/svg/about/diamond.svg";

interface Stats {
  orders: number;
  products: number;
  stores: number;
  users: number;
}

const AboutUs = () => {
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    products: 0,
    stores: 0,
    users: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await HomeService.fetchAbout();
      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="px-15 top-space pt-0">
      <h2 className="fw-bold mb-2">Welcome to eTrendix</h2>
      <div className="help-img">
        <img
          src={intoIMG}
          className="img-fluid rounded-1 mb-3 w-100"
          alt="Introduction"
        />
      </div>
      <h4 className="mb-2">
        Your all-in-one destination for everything from groceries to
        electronics, fashion, and more.
      </h4>
      <p className="content-color">
        At eTrendix, we believe that shopping should be simple, diverse, and
        convenient.
      </p>

      <h3 className="fw-bold mb-3">Our Journey</h3>

      <h3 className="fw-bold mb-3">Why Choose eTrendix?</h3>
      <ul className="content-color">
        <li>
          <strong>Diverse Selection:</strong> From groceries to fashion,
          electronics, and more, we offer a broad range of products across
          multiple categories.
        </li>
        <li>
          <strong>Easy Shopping Experience:</strong> Our platform makes it easy
          to browse, compare, and purchase products from stores.
        </li>
      </ul>

      <h3 className="fw-bold mb-3">Our Achievements</h3>
      <div className="about-stats">
        <div className="row g-3 mb-4">
          <div className="col-md-4 col-6">
            <div className="stats-box">
              <div className="top-part">
                <img src={usersSVG} className="img-fluid" alt="Users" />
                <h2>
                  {stats.users}+ <span>Users</span>
                </h2>
              </div>
              <h6 className="content-color">
                Join our growing community of shoppers across categories.
              </h6>
            </div>
          </div>
          <div className="col-md-4 col-6">
            <div className="stats-box">
              <div className="top-part">
                <img src={storesSVG} className="img-fluid" alt="Stores" />
                <h2>
                  {stats.stores}+ <span>Stores</span>
                </h2>
              </div>
              <h6 className="content-color">
                Partnered with stores offering a variety of products for every
                need.
              </h6>
            </div>
          </div>
          <div className="col-md-4 col-6">
            <div className="stats-box">
              <div className="top-part">
                <img src={deliverySVG} className="img-fluid" alt="Orders" />
                <h2>
                  {stats.orders}+ <span>Orders</span>
                </h2>
              </div>
              <h6 className="content-color">
                Thousands of orders delivered across multiple categories.
              </h6>
            </div>
          </div>
          <div className="col-md-4 col-6">
            <div className="stats-box">
              <div className="top-part">
                <img src={diamondSVG} className="img-fluid" alt="Brands" />
                <h2>
                  {stats.products}+ <span>Brands</span>
                </h2>
              </div>
              <h6 className="content-color">
                Discover products from numerous brands, offering quality and
                variety.
              </h6>
            </div>
          </div>
        </div>
      </div>

      <h3 className="fw-bold mb-3">Our Promise</h3>
      <p className="content-color">
        At eTrendix, we’re committed to providing a seamless shopping experience
        with a vast range of choices. Whether you're shopping for groceries,
        gadgets, or apparel, we’re here to deliver convenience and quality at
        every step.
      </p>
    </section>
  );
};

export default AboutUs;
