import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SellerService from "../../services/SellerService";
import { useUser } from "../../context/UserContext";

const Panel = () => {
  const [stats, setStats] = useState<any>();
  const { userData } = useUser();

  const fetchOrderStats = async () => {
    try {
      const response = await SellerService.fetchOrderStats();

      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchOrderStats();
  }, []);

  return (
    <>
      <section className="px-15 top-space">
        <div className="">
          {(stats?.pending > 0 ||
            stats?.active > 0 ||
            stats?.outForDelivery > 0 ||
            stats?.returnRequest > 0 ||
            stats?.replaceRequest > 0 ||
            stats?.cancelled > 0 ||
            stats?.returned > 0) && (
            <>
              {/* orders start */}
              <nav className="navbar navbar-light bg-light mb-2">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">
                    Orders
                  </a>
                </div>
              </nav>
              <div className="row">
                {stats?.pending > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-primary-subtle">
                      <Link to="/store-panel/assignedOrders/pending">
                        <div className="card-body">
                          <h5 className="card-title">
                            Pending Orders{" "}
                            {stats?.pending > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.pending})
                                <span className="visually-hidden">
                                  Pending Orders
                                </span>
                              </span>
                            )}
                            <span className="text-warning">
                              ({stats?.pending})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
                {stats?.active > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-primary-subtle">
                      <Link to="/store-panel/assignedOrders/active">
                        <div className="card-body">
                          <h5 className="card-title">
                            Active Orders{" "}
                            {stats?.active > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.active})
                                <span className="visually-hidden">
                                  Pending Orders
                                </span>
                              </span>
                            )}
                            <span className="text-warning">
                              ({stats?.active})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {stats?.outForDelivery > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-info">
                      <Link to="/store-panel/assignedOrders/outForDelivery">
                        <div className="card-body">
                          <h5 className="card-title">
                            Out for delivery Orders{" "}
                            {stats?.outForDelivery > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.outForDelivery})
                                <span className="visually-hidden">
                                  outForDelivery Orders
                                </span>
                              </span>
                            )}
                            <span className="text-success">
                              ({stats?.outForDelivery})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
                {stats?.returnRequest > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-danger bg-gradient">
                      <Link to="/store-panel/assignedOrders/return">
                        <div className="card-body">
                          <h5 className="card-title">
                            Return Request{" "}
                            {stats?.returnRequest > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.returnRequest})
                                <span className="visually-hidden">
                                  returnRequest Orders
                                </span>
                              </span>
                            )}
                            <span className="text-warning">
                              ({stats?.returnRequest})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
                {stats?.replaceRequest > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-danger bg-gradient">
                      <Link to="/store-panel/assignedOrders/replace">
                        <div className="card-body">
                          <h5 className="card-title">
                            Replace Request{" "}
                            {stats?.replaceRequest > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.replaceRequest})
                                <span className="visually-hidden">
                                  replace Request Orders
                                </span>
                              </span>
                            )}
                            <span className="text-warning">
                              ({stats?.replaceRequest})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
                {stats?.cancelled > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-danger">
                      <Link to="/store-panel/assignedOrders/cancelled">
                        <div className="card-body">
                          <h5 className="card-title">
                            Canceled Orders{" "}
                            {stats?.cancelled > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.cancelled})
                                <span className="visually-hidden">
                                  cancelled Orders
                                </span>
                              </span>
                            )}
                            <span className="text-warning">
                              ({stats?.cancelled})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
                {stats?.returned > 0 && (
                  <div className="col-6 mb-2 position-relative">
                    <div className="card bg-danger">
                      <Link to="/store-panel/assignedOrders/returned">
                        <div className="card-body">
                          <h5 className="card-title">
                            Returned Orders{" "}
                            {stats?.returned > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ({stats?.returned})
                                <span className="visually-hidden">
                                  Returned Orders
                                </span>
                              </span>
                            )}
                            <span className="text-warning">
                              ({stats?.returned})
                            </span>
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* orders end */}
            </>
          )}
          {userData.userType == "store" && (
            <>
              {/* products start */}

              <nav className="navbar navbar-light bg-light mb-2">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">
                    Products
                  </a>
                </div>
              </nav>

              <div className="row">
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/inventory">
                      <div className="card-body">
                        <h5 className="card-title">Inventory</h5>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/add-to-inventory">
                      <div className="card-body">
                        <h5 className="card-title">Add To Inventory</h5>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/add-product">
                      <div className="card-body">
                        <h5 className="card-title">Add Product</h5>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* products end */}

              {/* Store start */}
              <nav className="navbar navbar-light bg-light mb-2">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">
                    Store
                  </a>
                </div>
              </nav>

              <div className="row">
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/add-store-person">
                      <div className="card-body">
                        <h5 className="card-title">Add Store persons</h5>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/store-persons">
                      <div className="card-body">
                        <h5 className="card-title">Store persons</h5>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Store end */}

              {/* logistics start */}
              <nav className="navbar navbar-light bg-light mb-2">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">
                    Logistics
                  </a>
                </div>
              </nav>

              <div className="row">
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/deliverable-addresses">
                      <div className="card-body">
                        <h5 className="card-title">Deliverable Addresses</h5>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="card bg-info-subtle">
                    <Link to="/store-panel/delivery-charges">
                      <div className="card-body">
                        <h5 className="card-title">Delivery Charges</h5>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              {/* logistics end */}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Panel;
