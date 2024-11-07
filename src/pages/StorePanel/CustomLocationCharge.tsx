import React, { useEffect, useState } from "react";
import { Table, Button, InputGroup, FormControl } from "react-bootstrap";
import SellerService from "../../services/SellerService";
import { toast } from "react-toastify";

interface Location {
  _id: string;
  pincode: {
    pincode: string;
    Name: string;
    State: string;
    City: string;
    Street: string;
  };
  deliveryCharge?: number;
}

const CustomLocationCharge: React.FC = () => {
  const [page, setPage] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [updatedCharges, setUpdatedCharges] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // Track if more data is available

  const getDeliverableLocation = async () => {
    setLoading(true);
    try {
      const response = await SellerService.deliverableLocation(page);
      if (response.data.status === "success") {
        if (response.data.data.length === 0) {
          setHasMore(false); // No more data available
        } else {
          setLocations((prev) => [...prev, ...response.data.data]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeliverableLocation();
  }, [page]);

  const handleChargeChange = (id: string, value: number) => {
    setUpdatedCharges((prevCharges) => ({
      ...prevCharges,
      [id]: value,
    }));
  };

  const updateCharge = async (id: string) => {
    const charge = updatedCharges[id];
    const ToastID = toast.loading("Please wait...");

    try {
      const response = await SellerService.updateCustomCharges(charge, id);
      const data = response.data;

      if (data.status === "success") {
        toast.update(ToastID, {
          render: data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 2000,
        });

        setUpdatedCharges((prevCharges) => {
          const newCharges = { ...prevCharges };
          delete newCharges[id];
          return newCharges;
        });
      }
    } catch (error: any) {
      console.error(error);

      toast.update(ToastID, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Pincode</th>
              <th>Area</th>
              <th>Street</th>
              <th>State</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <React.Fragment key={loc._id}>
                <tr>
                  <td>{loc.pincode.pincode}</td>
                  <td>{loc.pincode.Name}</td>
                  <td>{loc.pincode.Street}</td>
                  <td>{loc.pincode.State}</td>
                  <td>{loc.pincode.City}</td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>₹</InputGroup.Text>
                      <FormControl
                        type="number"
                        defaultValue={loc.deliveryCharge || 0}
                        onChange={(e) =>
                          handleChargeChange(loc._id, Number(e.target.value))
                        }
                      />
                      {updatedCharges[loc._id] !== undefined && (
                        <Button
                          variant="primary"
                          onClick={() => updateCharge(loc._id)}
                        >
                          Update
                        </Button>
                      )}
                    </InputGroup>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="text-center">
        {loading ? (
          <Button disabled>Loading...</Button>
        ) : hasMore ? (
          <Button onClick={loadMore}>Load More</Button>
        ) : (
          <p>No more locations to load.</p>
        )}
      </div>
    </div>
  );
};

export default CustomLocationCharge;
