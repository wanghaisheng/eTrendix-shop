import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { useBody } from "../../context/BodyContext";
import SellerService from "../../services/SellerService";
import FilterPanel from "./Components/FilterPanel";
import ProductsListing from "./Components/ProductsListing";

const AddToInventory = () => {
  const [categories, setCategories] = useState<any>([]);
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
    setHeaderName(["Store Panel", "Add to Inventory"]);
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filter.reset) {
      setProducts([]);
      setHasMore(true);
    }
    fetchNotInInventory();
  }, [filter]);

  const fetchNotInInventory = async () => {
    setLoading(true);

    try {
      const response = await SellerService.notInInventory(filter);
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

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories("all");
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <>
      <FilterPanel
        setFilter={setFilter}
        filter={filter}
        categories={categories}
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

export default AddToInventory;
