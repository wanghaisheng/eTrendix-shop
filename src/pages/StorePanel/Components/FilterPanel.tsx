import { useEffect, useState } from "react";
import CategoryService from "../../../services/CategoryService";

const FilterPanel = ({
  setFilter,
  filter,
  subCategories,
  setSubCategories,
}: any) => {
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const callSubCat = async (data: any) => {
    setSubCategories(null);
    const catSlug = data.target.value;

    setFilter({
      ...filter,
      page: 1,
      category: catSlug,
      sub_category: "",
      reset: true,
    });

    try {
      const response = await CategoryService.getCategories(catSlug);
      if (response.status === 200) {
        setSubCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      // Handle error if necessary
    }
  };

  return (
    <div className="search-panel top-space px-15">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <strong>Filters</strong>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="Category">
                    Category
                  </label>
                  <select
                    id="Category"
                    className="form-select"
                    aria-label="Category"
                    onChange={(e) => {
                      callSubCat(e);
                    }}
                  >
                    <option value="">Please select</option>
                    {categories?.data?.map((category: any, index: number) => (
                      <option key={index} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="subCategory">
                    Sub Category
                  </label>
                  <select
                    id="subCategory"
                    className="form-select"
                    aria-label="subCategory"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        page: 1,
                        sub_category: e.target.value,
                        reset: true,
                      });
                    }}
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories?.data?.map(
                      (category: any, index: number) => (
                        <option key={index} value={category.slug}>
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <label className="form-label" htmlFor="search">
                    Search
                  </label>
                  <input
                    className="form-control"
                    id="search"
                    type="text"
                    placeholder="eg. pixel 5/15 PRO"
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        page: 1,
                        search: e.target.value,
                        reset: true,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
