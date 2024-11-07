import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ProductService from "../../services/ProductService";

const SearchPanel = ({ filter, setFilter, spacing = true }: any) => {
  const [show, setShow] = useState(false);
  const [filterData, setFilterData] = useState<any>();
  const [tempFilter, setTempFilter] = useState({
    ...filter,
    brands: filter.brands || [],
    sellers: filter.sellers || [],
  });

  useEffect(() => {
    setTempFilter({
      ...filter,
      brands: filter.brands || [],
      sellers: filter.sellers || [],
    });
  }, [filter]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateFilter = (updatedFields: any) => {
    setTempFilter((prev: any) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const toggleArrayItem = (array: any[], value: any) => {
    if (array.includes(value)) {
      return array.filter((item) => item !== value); // Remove the value if it already exists
    } else {
      return [...array, value]; // Add the value if it doesn't exist
    }
  };

  const applyFilter = () => {
    setFilter({
      ...tempFilter,
      page: 1,
      reset: true,
    });
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await ProductService.getFilters(filter);
      if (response.status === 200) {
        setFilterData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState(""); // Temporary state to hold the search input
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous timeout
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Set a new timeout to update the filter after 300ms of no typing
    const newTimeout = setTimeout(() => {
      setFilter((prevFilter: any) => ({
        ...prevFilter,
        search: value,
        reset: true,
        page: 1,
      }));
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      <div className={`search-panel ${spacing && "top-space"} xl-space px-15`}>
        <div className="search-bar">
          <input
            className="form-control form-theme"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="iconly-Search icli search-icon"></i>
        </div>
        <div className="filter-btn" onClick={handleShow}>
          <i className="iconly-Filter icli"></i>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        fullscreen={true}
        className="modal filter-modal"
      >
        <div className="modal-content">
          <Modal.Header closeButton>
            <h2>Filters</h2>
          </Modal.Header>
          <div className="modal-body">
            <div className="filter-box">
              <h2 className="page-title">Sort By:</h2>
              <div className="filter-content">
                <select
                  className="form-select form-control form-theme"
                  aria-label="Default select example"
                  value={tempFilter.sortBy || ""}
                  onChange={(e) => {
                    updateFilter({
                      sortBy: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="">Recommended</option>
                  <option value={1}>Popularity</option>
                  <option value={2}>What's New</option>
                  <option value={3}>Price: High to Low</option>
                  <option value={4}>Price: Low to High</option>
                  <option value={5}>Customer rating</option>
                </select>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-box">
              <h2 className="filter-title">Brand:</h2>
              <div className="filter-content">
                <ul className="row filter-row g-3">
                  {filterData?.brands?.map((brand: any, index: number) => (
                    <li
                      className={`col-6 ${
                        tempFilter.brands.includes(brand._id) && "active"
                      }`}
                      key={index}
                      onClick={() => {
                        updateFilter({
                          brands: toggleArrayItem(tempFilter.brands, brand._id),
                        });
                      }}
                    >
                      <div className="filter-col">{brand._id}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Seller Filter */}
          </div>

          <div className="modal-footer">
            <a href="#" className="reset-link">
              RESET
            </a>
            <a
              className="btn btn-solid"
              onClick={() => {
                applyFilter();
                handleClose();
              }}
            >
              apply filters
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchPanel;
