import { Link } from "react-router-dom";
import ReactSlickSlider from "react-slick"; // Optionally import placeholder styles

const Slider = ({ banners, loader }: any) => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "30px",
    dots: true,
    arrows: false,
    height: "300px",
    // autoplay: true,
  };

  return (
    <section className="pt-0 home-section ratio_55">
      <div className="home-slider slick-default theme-dots">
        {/* Show loading placeholder if banners are not available or loader is true */}
        {loader ? (
          <div className="placeholder-content">
            <div className="placeholder-wave">
              <div
                className="placeholder bg-secondary"
                style={{ width: "100%", height: "300px" }}
              ></div>
            </div>
          </div>
        ) : (
          <ReactSlickSlider {...settings}>
            {banners &&
              banners.map((val: any, key: number) => (
                <div className="slider-box" key={key}>
                  <img src={val.banner} className="img-fluid bg-img" alt="" />
                  <div className="slider-content">
                    <div>
                      <h2>Welcome To JL</h2>
                      <h1>Sale is live</h1>
                      <Link to="/seller-onboarding" className="btn btn-solid">
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </ReactSlickSlider>
        )}
      </div>
    </section>
  );
};

export default Slider;
