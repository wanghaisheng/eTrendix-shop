import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import OrderListing from "./OrderListing";

const OrderHistory = () => {
  const [orders, setOrders] = useState({ openOrders: [], pastOrders: [] });
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    openOrderPage: 1,
    openOrderimit: 10,
    pastOrderPage: 1,
    pastOrderimit: 10,
    search: "",
  });
  const [hasMoreOpenOrders, setHasMoreOpenOrders] = useState(true);
  const [hasMorePastOrders, setHasMorePastOrders] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await UserService.orderHistory(filter);
      if (response.status === 200) {
        setOrders((prevOrders) => ({
          openOrders:
            filter.openOrderPage === 1
              ? response.data.openOrders
              : [...prevOrders.openOrders, ...response.data.openOrders],
          pastOrders:
            filter.pastOrderPage === 1
              ? response.data.pastOrders
              : [...prevOrders.pastOrders, ...response.data.pastOrders],
        }));

        setHasMoreOpenOrders(
          response.data.openOrders.length >= filter.openOrderimit
        );
        setHasMorePastOrders(
          response.data.pastOrders.length >= filter.pastOrderimit
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreOpenOrders = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      openOrderPage: prevFilter.openOrderPage + 1,
    }));
  };

  const loadMorePastOrders = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      pastOrderPage: prevFilter.pastOrderPage + 1,
    }));
  };

  return (
    <>
      {/*  search panel start  */}
      <div className="search-panel top-space px-15">
        <div className="search-bar">
          <input className="form-control form-theme" placeholder="Search" />
          <i className="iconly-Search icli search-icon"></i>
          <i className="iconly-Camera icli camera-icon"></i>
        </div>
        <div className="filter-btn" onClick={() => setShowFilter(true)}>
          <i className="iconly-Filter icli"></i>
        </div>
      </div>
      {/*  search panel end  */}

      {/*  section start  */}
      <section className="px-15">
        <h2 className="page-title">Open Orders</h2>
        {orders.openOrders.length === 0 && <p>No open orders</p>}
        {orders.openOrders.length > 0 && (
          <OrderListing products={orders.openOrders} showBtn={true} />
        )}
        {hasMoreOpenOrders && (
          <ul className="pt-5">
            <li className="d-block">
              <button
                type="button"
                className="w-100 btn btn-outline"
                onClick={loadMoreOpenOrders}
              >
                Load More
              </button>
            </li>
          </ul>
        )}
      </section>
      <div className="divider"></div>
      {/*  section end  */}

      {/*  section start  */}
      <section className="section-b-space pt-0 px-15">
        <h2 className="page-title">Past Orders</h2>
        {orders.pastOrders.length === 0 && <p>No past orders</p>}
        {orders.pastOrders.length > 0 && (
          <OrderListing products={orders.pastOrders} showBtn={true} />
        )}
        {hasMorePastOrders && (
          <ul className="pt-5">
            <li className="d-block">
              <button
                type="button"
                className="w-100 btn btn-outline"
                onClick={loadMorePastOrders}
              >
                Load More
              </button>
            </li>
          </ul>
        )}
      </section>
      {/*  section end  */}

      {/*  add review canvas start  */}
      <div
        className={`${showFilter && " offcanvas-backdrop fade show"}`}
        onClick={() => {
          setShowFilter(false);
        }}
      ></div>
      <div
        className={`offcanvas offcanvas-bottom h-auto ${showFilter && "show"}`}
        id="offcanvasfilter"
      >
        <div className="offcanvas-body">
          <h2 className="mb-2">Filters</h2>
          <form className="mb-2">
            <div className="me-3 d-flex align-items-center mb-2">
              <input
                defaultChecked
                className="radio_animated"
                type="radio"
                name="filter"
                id="all"
                defaultValue="all"
              />
              <label htmlFor="all" className="content-color">
                All Orders
              </label>
            </div>
            <div className="me-3 d-flex align-items-center mb-2">
              <input
                className="radio_animated"
                type="radio"
                name="filter"
                id="open"
                defaultValue="open"
              />
              <label htmlFor="open" className="content-color">
                Open Orders
              </label>
            </div>
            <div className="d-flex align-items-center mb-2">
              <input
                className="radio_animated"
                type="radio"
                name="filter"
                id="return"
                defaultValue="return"
              />
              <label htmlFor="return" className="content-color">
                Return Orders
              </label>
            </div>
            <div className="d-flex align-items-center mb-2">
              <input
                className="radio_animated"
                type="radio"
                name="filter"
                id="cancelled"
                defaultValue="cancelled"
              />
              <label htmlFor="cancelled" className="content-color">
                Cancelled Orders
              </label>
            </div>
          </form>
          <h2 className="mb-2">Time Filter</h2>
          <form className="section-b-space mb-3">
            <div className="me-3 d-flex align-items-center mb-2">
              <input
                defaultChecked
                className="radio_animated"
                type="radio"
                name="time"
                id="last30"
                defaultValue="last30"
              />
              <label htmlFor="last30" className="content-color">
                Last 30 Days
              </label>
            </div>
            <div className="me-3 d-flex align-items-center mb-2">
              <input
                className="radio_animated"
                type="radio"
                name="time"
                id="last6"
                defaultValue="last6"
              />
              <label htmlFor="last6" className="content-color">
                Last 6 Months
              </label>
            </div>
            <div className="d-flex align-items-center mb-2">
              <input
                className="radio_animated"
                type="radio"
                name="time"
                id="2021"
                defaultValue="2021"
              />
              <label htmlFor="2021" className="content-color">
                2021
              </label>
            </div>
            <div className="d-flex align-items-center mb-2">
              <input
                className="radio_animated"
                type="radio"
                name="time"
                id="2020"
                defaultValue="2020"
              />
              <label htmlFor="2020" className="content-color">
                2020
              </label>
            </div>
          </form>
          <div className="cart-bottom row m-0">
            <div>
              <div className="left-content col-5">
                <a href="#" className="title-color">
                  BACK
                </a>
              </div>
              <a
                data-bs-dismiss="offcanvas"
                href="#0"
                className="btn btn-solid col-7 text-uppercase"
              >
                Apply
              </a>
            </div>
          </div>
        </div>
      </div>
      {/*  add review canvas end  */}
    </>
  );
};

export default OrderHistory;
