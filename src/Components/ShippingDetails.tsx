const ShippingDetails = ({ order }: any) => {
  return (
    <div className="px-15">
      <h6 className="tracking-title content-color">Shipping Details</h6>

      <h4 className="fw-bold mb-1">{order?.addressData?.name}</h4>
      <h4 className="content-color">
        {order?.addressData?.address},{order?.pincodeData?.area}
      </h4>
      <h4 className="content-color">
        {order?.pincodeData?.City}, {order?.pincodeData?.State}
      </h4>
      <h4 className="content-color">{order?.pincodeData?.pincode}</h4>
      <h4 className="fw-bold mt-1">Phone No: {order?.addressData?.phone}</h4>
      <h4 className="fw-bold mt-1">Landmark: {order?.addressData?.landmark}</h4>
      <h4 className="fw-bold mt-1 text-capitalize">
        Delivery Type: {order?.addressData?.addressType}
      </h4>
      <h4 className="fw-bold mt-1">
        Receipt ID: #{order?.receiptID || order?.receipt}
      </h4>
    </div>
  );
};

export default ShippingDetails;
