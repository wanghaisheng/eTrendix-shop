import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchPanel from "./SearchPanel";
import ProductListing from "./ProductListing";
import { useUser } from "../../context/UserContext";
import { useBody } from "../../context/BodyContext";

const Products = ({ opFilter }: any) => {
  const { selectedLocation } = useUser();
  const { setHeaderName }: any = useBody();

  const query = new URLSearchParams(location.search).get("q");

  const { category, subCategory } = useParams();

  useEffect(() => {
    if (filter.search != query) {
      setFilter({
        ...filter,
        page: 1,
        search: query || "",
        reset: true,
        brands: "",
      });
      setHeaderName(["Search", query]);
    }
  }, [query]);

  useEffect(() => {
    setHeaderName(["Search", query]);
  }, []);

  const [filter, setFilter] = useState({
    page: 1,
    reset: false,
    isWishlist: opFilter?.isWishlist || false,
    category: category || "",
    subCategory: subCategory || "",
    pincode_id: selectedLocation?._id || "",
    store_id: opFilter?.store_id || "",
    search: query || "",
    brands: "",
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
