import { useEffect, useState } from "react";
import HomeService from "../../services/HomeService";
import Category from "./Category";
import DayDeals from "./DayDeals";
import Slider from "./Slider";
import ShopByCategories from "./ShopByCategories";
import Prompt from "./Prompt";

const Home = () => {
  const [ads, setAds] = useState<any>();
  const [adsLoader, setAdsLoader] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setAdsLoader(true);
    try {
      const response = await HomeService.fetchAds();

      if (response.status === 200) {
        setAds(response.data);
      }

      setAdsLoader(false);
    } catch (error) {
      setAdsLoader(false);
    }
  };

  return (
    <>
      <Category />
      <div className="divider t-12 b-20"></div>
      <Slider banners={ads?.banners} loader={adsLoader} />
      <DayDeals />
      <div className="divider"></div>
      {/* <TabSection /> */}
      <ShopByCategories />
      <Prompt />
    </>
  );
};

export default Home;
