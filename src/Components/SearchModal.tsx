import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import xSVG from "../assets/svg/x.svg";
import denimPNG from "../assets/images/category/denim.png";
import skirtsPNG from "../assets/images/category/skirts.png";
import flowerprintPNG from "../assets/images/category/flowerprint.png";
import { useUser } from "../context/UserContext";
import UserService from "../services/UserService";

type SearchFormValues = {
  searchQuery: string;
};

// Zod schema for validation
const searchSchema = z.object({
  searchQuery: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),
});

const SearchModal = ({
  showSearch,
  setShowSearch,
}: {
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
}) => {
  const { userData } = useUser();

  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<any>();

  const { register, handleSubmit } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormValues) => {
    // Redirect to /s?q=searchQuery
    navigate(`/search?q=${encodeURIComponent(data.searchQuery)}`);
    setShowSearch(false); // Close modal on submit
  };

  useEffect(() => {
    if (showSearch) {
      if (userData.phone) {
        fetchSearchSuggestions();
      }
    }
  }, [showSearch]);

  const fetchSearchSuggestions = async () => {
    try {
      const response = await UserService.fetchSearchSuggestions();
      if (response.status === 200) {
        setRecentSearches(response.data);
      }
    } catch (error) {}
  };

  return (
    <Modal
      show={showSearch}
      onHide={() => setShowSearch(false)}
      fullscreen={true}
    >
      <Modal.Body>
        <div className="search-panel w-back  ">
          <a onClick={() => setShowSearch(false)} className="back-btn">
            <i className="iconly-Arrow-Left icli"></i>
          </a>
          {/* Wrap input in a form and handle submission */}
          <form onSubmit={handleSubmit(onSubmit)} className="search-bar">
            <input
              {...register("searchQuery")}
              className="form-control form-theme"
              placeholder="Search"
            />
            <i className="iconly-Search icli search-icon"></i>
          </form>
        </div>

        {recentSearches && (
          <section className="recent-search-section mt-3">
            <h4 className="page-title">Recent Searches</h4>
            <ul>
              {recentSearches.map((item: any, index: number) => (
                <li key={index}>
                  <Link
                    to={`/search?q=${item.searchQuery}`}
                    onClick={() => setShowSearch(false)}
                  >
                    <i className="iconly-Time-Circle icli"></i>{" "}
                    {item.searchQuery}
                    <img src={xSVG} className="img-fluid delete-icon" alt="" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Recommended section */}
        <section className="inner-category mt-4">
          <h4 className="page-title">Trending Categories</h4>
          <div className="row gx-3">
            <div className="col-4">
              <a href="shop.html">
                <img src={flowerprintPNG} className="img-fluid" alt="" />
                <h4>Flowerprint</h4>
              </a>
            </div>
            <div className="col-4">
              <a href="shop.html">
                <img src={denimPNG} className="img-fluid" alt="" />
                <h4>Denim</h4>
              </a>
            </div>
            <div className="col-4">
              <a href="shop.html">
                <img src={skirtsPNG} className="img-fluid" alt="" />
                <h4>Skirts</h4>
              </a>
            </div>
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSearch(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
