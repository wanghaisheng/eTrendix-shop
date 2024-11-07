import { useState } from "react";
import { useParams } from "react-router-dom";
import SearchPanel from "./SearchPanel";
import ProductListing from "./ProductListing";
import { useUser } from "../../context/UserContext";

const Products = ({ opFilter }: any) => {
  const { selectedLocation } = useUser();

  const { category, subCategory } = useParams();

  const [filter, setFilter] = useState({
    page: 1,
    reset: false,
    isWishlist: opFilter?.isWishlist || false,
    category: category || "",
    subCategory: subCategory || "",
    pincode_id: selectedLocation?._id || "",
    store_id: opFilter?.store_id || "",
    limitPerPage: 20,
  });

  return (
    <>
      <SearchPanel
        filter={filter}
        setFilter={setFilter}
        spacing={opFilter?.store_id ? false : true}
      />
      <ProductListing filter={filter} setFilter={setFilter} />
    </>
  );
};

export default Products;
