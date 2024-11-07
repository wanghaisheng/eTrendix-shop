import { Link } from "react-router-dom";
import emptyCartImage from "../../assets/images/empty-cart.png";

const EmptyCart = () => {
  return (
    <>
      <section className="px-15">
        <div className="empty-cart-section text-center">
          <img src={emptyCartImage} className="img-fluid" alt="" />
          <h2>Whoops !! Cart is Empty</h2>
          <p>
            Looks like you haven’t added anything to your cart yet. You will
            find a lot of interesting products on our “Shop” page
          </p>
          <Link to="/" className="btn btn-solid w-100">
            start shopping
          </Link>
        </div>
      </section>
    </>
  );
};

export default EmptyCart;
