import { useEffect, useState } from "react";
import { useBody } from "../../context/BodyContext";
import SellerService from "../../services/SellerService";
import FilterPanel from "./Components/FilterPanel";
import ProductsListing from "./Components/ProductsListing";

const Inventory = () => {
  const [subCategories, setSubCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    page: 1,
    category: "",
    sub_category: "",
    search: "",
    reset: true,
  });

  const { setHeaderName }: any = useBody();

  useEffect(() => {
    setHeaderName(["Store Panel", "Inventory"]);
  }, []);

  useEffect(() => {
    if (filter.reset) {
      setProducts([]);
      setHasMore(true);
    }
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    setLoading(true);

    try {
      const response = await SellerService.inventory(filter);
      if (response.status === 200) {
        setLoading(false);
        const newProducts = response.data?.data || [];
        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevProducts: any) => [...prevProducts, ...newProducts]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <FilterPanel
        setFilter={setFilter}
        filter={filter}
        subCategories={subCategories}
        setSubCategories={setSubCategories}
      />

      <ProductsListing
        products={products}
        loading={loading}
        hasMore={hasMore}
        setFilter={setFilter}
        filter={filter}
      />
    </>
  );
};

export default Inventory;
