import { ReactNode } from "react";
import womenPNG from "../../assets/images/category/women.png";

interface Props {
  children: ReactNode;
}

const CategoryTitle = ({ children }: Props) => {
  return (
    <section className="category-listing px-15 xl-space top-space pt-3">
      <a href="shop.html" className="category-wrap">
        <div className="content-part">
          <h2>{children}</h2>
          <h4>t-shirts, tops, bottoms..</h4>
        </div>
        <div className="img-part">
          <img src={womenPNG} className="img-fluid" alt="" />
        </div>
      </a>
    </section>
  );
};

export default CategoryTitle;
