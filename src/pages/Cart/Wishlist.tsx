import Products from "../Products/Products";

const Wishlist = () => {
  return <Products opFilter={{ isWishlist: true }} />;
};

export default Wishlist;
