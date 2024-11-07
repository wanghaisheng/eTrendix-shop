const PriceDetails = ({ order }: any) => {
  return (
    <div className="order-details">
      <ul>
        <li>
          <h4>
            Bag total <span>{order?.orderData?.amount}</span>
          </h4>
        </li>
        {order?.orders?.map((value: any, key: any) => (
          <li key={key}>
            <h4>
              Shipping charges by {value?.seller?.shop_name}
              <span className="text-green">₹{value.delivery_charge}</span>
            </h4>
          </li>
        ))}
      </ul>
      <div className="total-amount">
        <h4>
          Total Amount <span>{order?.orderData?.totalAmount}</span>
        </h4>
      </div>
      <a href="#" className="btn btn-outline content-color w-100 mt-4">
        Download Invoice
      </a>
    </div>
  );
};

export default PriceDetails;
