import { useParams } from "react-router-dom";
import StoreRequest from "./StoreRequest";

const index = () => {
  const { link } = useParams();

  return (
    <div>
      <section className="cart-section pt-0 top-space xl-space">
        {link == "storeRequest" && <StoreRequest />}
      </section>
    </div>
  );
};

export default index;
