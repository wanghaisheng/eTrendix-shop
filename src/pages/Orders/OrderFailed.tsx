import { MdCancel } from "react-icons/md";
import { useLocation } from "react-router-dom";

const OrderFailed = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const txnId = queryParams.get("txnId");
  const bankTxnId = queryParams.get("bankTxnId");
  const orderId = queryParams.get("orderId");
  const txnAmount = queryParams.get("txnAmount");
  const bankName = queryParams.get("bankName");
  const paymentMode = queryParams.get("paymentMode");
  const txnDate = queryParams.get("txnDate");

  return (
    <div className="px-15 top-space xl-space container">
      {/* Order Failure Section */}
      <section className="text-center p-4 border rounded shadow-sm bg-light">
        <MdCancel size="50" className="text-danger" />
        <h1 className="text-danger">Payment Failed!</h1>
        <h2 className="text-muted">
          Unfortunately, your payment could not be processed.
        </h2>
      </section>

      {/* Divider */}
      <hr className="my-4" />

      {/* Transaction Details Section */}
      <div className="card border-light shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Transaction Details</h3>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Transaction ID:</strong> {txnId}
            </li>
            <li className="list-group-item">
              <strong>Bank Transaction ID:</strong> {bankTxnId}
            </li>
            <li className="list-group-item">
              <strong>Order ID:</strong> {orderId}
            </li>
            <li className="list-group-item">
              <strong>Transaction Amount:</strong> ₹{txnAmount}
            </li>
            <li className="list-group-item">
              <strong>Bank Name:</strong> {bankName}
            </li>
            <li className="list-group-item">
              <strong>Payment Mode:</strong> {paymentMode}
            </li>
            <li className="list-group-item">
              <strong>Transaction Date:</strong> {txnDate}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
