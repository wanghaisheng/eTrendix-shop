const TabSection = () => {
  return (
    <section className="pt-1 tab-section">
      <div className="title-section px-15">
        <h2>Find your Style</h2>
        <h3>Super Summer Sale</h3>
      </div>
      <div className="tab-section">
        <ul className="nav nav-tabs theme-tab pl-15">
          <li className="nav-item">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#trending"
              type="button"
            >
              Trending Now
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#top"
              type="button"
            >
              Top Picks
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#featured"
              type="button"
            >
              Featured Products
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#rated"
              type="button"
            >
              Top Rated
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#ship"
              type="button"
            >
              Ready to ship
            </button>
          </li>
        </ul>
        <div className="tab-content px-15">
          <div className="tab-pane fade show active" id="trending">
            <div className="row gy-3 gx-3">
              <div className="col-md-4 col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/4.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/5.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/6.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/7.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="top">
            <div className="row gy-3 gx-3">
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/6.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/7.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/4.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/5.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="featured">
            <div className="row gy-3 gx-3">
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/7.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/4.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/5.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/6.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="rated">
            <div className="row gy-3 gx-3">
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/5.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/4.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/7.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/6.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="ship">
            <div className="row gy-3 gx-3">
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/4.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/6.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/7.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="product-box ratio_square">
                  <div className="img-part">
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/5.jpg"
                        alt=""
                        className="img-fluid bg-img"
                      />
                    </a>
                    <div className="wishlist-btn">
                      <i className="iconly-Heart icli"></i>
                      <i className="iconly-Heart icbo"></i>
                      <div className="effect-group">
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                        <span className="effect"></span>
                      </div>
                    </div>
                  </div>
                  <div className="product-content">
                    <ul className="ratings">
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo"></i>
                      </li>
                      <li>
                        <i className="iconly-Star icbo empty"></i>
                      </li>
                    </ul>
                    <a href="product.html">
                      <h4>Blue Denim Jacket</h4>
                    </a>
                    <div className="price">
                      <h4>
                        $32.00 <del>$35.00</del>
                        <span>20%</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabSection;
