import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { useParams } from "react-router-dom";
import ReviewList from "../../Components/ReviewList";
import { useBody } from "../../context/BodyContext";

const ProductReviews = () => {
  const { slug } = useParams();
  const { setHeaderName }: any = useBody();

  const [filter, setFilter] = useState({
    page: 1,
  });

  const [reviews, setReviews] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await UserService.getReviews(slug, filter);
      if (response.status === 200) {
        const newReviews = response.data.data;
        setReviews((prevReviews: any) => [...prevReviews, ...newReviews]);
        setTotal(response.data.total_count); // Update the total count
        if (newReviews.length === 0) {
          setHasMore(false); // No more reviews to load
        }
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    setHeaderName(["Product", "Reviews"]);

    fetchReviews();
  }, [filter]);

  const loadMoreReviews = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };

  return (
    <section className="top-space pt-2">
      <ReviewList reviews={reviews} count={total} slug={null} />
      {hasMore && (
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary" onClick={loadMoreReviews}>
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
