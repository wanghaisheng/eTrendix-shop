import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { toast } from "react-toastify";

const StoreRequest = () => {
  const [requestData, setRequestData] = useState<any>(null);

  useEffect(() => {
    fetchStoreRequest();
  }, []);

  const fetchStoreRequest = async () => {
    try {
      const response = await UserService.fetchStoreRequest();
      if (response.status === 200) {
        setRequestData(response.data.data); // Fetch the first request, if any
      }
    } catch (error) {
      console.log(error);
    }
  };

  const respondStoreRequest = async (id: string, status: string) => {
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await UserService.respondStoreRequest(id, status);

      if (response.status === 200) {
        fetchStoreRequest();

        toast.update(Toastid, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 1000,
        });
      }
    } catch (error: any) {
      console.log(error);

      const message = error.response.data.message || "Something went wrong";

      toast.update(Toastid, {
        render: message,
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      {requestData?.map((data: any, index: number) => {
        return (
          <div className="card" key={index}>
            <div className="card-header">Store Request</div>
            <div className="card-body">
              <h5 className="card-title">
                Store: <strong>{data.store_id.shop_name}</strong>
              </h5>
              <p className="card-text">
                You have been requested to join the store as a{" "}
                <strong>{data.position}</strong>.
              </p>
              <p className="card-text">
                Request was made {data.time}. Status:{" "}
                <strong>{data.status}</strong>
              </p>
              <a
                onClick={() => {
                  respondStoreRequest(data._id, "accept");
                }}
                className="btn btn-primary me-2"
              >
                Accept
              </a>
              <a
                onClick={() => {
                  respondStoreRequest(data._id, "decline");
                }}
                className="btn btn-danger"
              >
                Decline
              </a>
            </div>
          </div>
        );
      })}

      {requestData?.length == 0 && (
        <div className="card">
          <div className="card-body">
            <p className="card-text">
              <strong>No Request found</strong>.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreRequest;
