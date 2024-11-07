import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Spinner,
  Table,
  FormCheck,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import SellerService from "../../services/SellerService";
import { toast } from "react-toastify";
import { IoInformationCircleOutline } from "react-icons/io5";

interface Pincode {
  _id: string;
  pincode: string;
  Name: string;
  Street: string;
  State: string;
  City: string;
  District: string;
}

const DeliverableAddresses: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [cites, setCites] = useState<Pincode[]>([]);
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const fetchPincode = async () => {
    setShowLoader(true);
    try {
      const response = await SellerService.fetchPincode(page, search);

      if (response.status === 200) {
        setPincodes(response.data.pincodes);
        setCites(response.data.selectedCities);
        setSelectedPincodes(response.data.selectedPincodes);
        setSelectedCities(
          response.data.selectedCities?.map((c: any) => c.code)
        );
      }
    } catch (error: any) {
      console.error(error.response?.data || error);
      if (error.response?.data.message) {
        toast.info(error.response.data.message, {
          position: "bottom-center",
        });
      }
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchPincode();
  }, [page]);

  const pincodeChecked = async (isChecked: boolean, pincodeID: any) => {
    const ToastID = toast.loading("Please wait...");
    try {
      const response = await SellerService.updateDelAddress(
        pincodeID,
        isChecked
      );
      const data = response.data;

      if (data.status === "success") {
        if (isChecked) {
          setSelectedPincodes((prevSelected) => [...prevSelected, pincodeID]);
        } else {
          setSelectedPincodes((prevSelected) =>
            prevSelected.filter((id) => id !== pincodeID)
          );
        }

        toast.update(ToastID, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      if (error.response?.data.message) {
        toast.update(ToastID, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    }
  };

  const locationChecked = async (isChecked: boolean, cityData: any) => {
    const ToastID = toast.loading("Please wait...");
    try {
      const response = await SellerService.updateDelCity(cityData, isChecked);
      const data = response.data;

      if (data.status === "success") {
        if (isChecked) {
          setSelectedCities((prevSelected) => [...prevSelected, cityData.code]);
        } else {
          setSelectedCities((prevSelected) =>
            prevSelected.filter((id) => id !== cityData.code)
          );
        }

        toast.update(ToastID, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.update(ToastID, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const searchPincodes = () => {
    setPage(1);
    setPincodes([]); // Reset pincodes before new search
    fetchPincode();
  };

  return (
    <>
      <div className="top-space px-15">
        <div className="row g-3">
          <Col xs="auto">
            <Form.Control
              type="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={searchPincodes}
              disabled={showLoader}
            >
              {showLoader ? (
                <>
                  <Spinner
                    as="span"
                    size="sm"
                    animation="border"
                    aria-hidden="true"
                  />{" "}
                  Loading...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </Col>
        </div>

        <div className="table-responsive mt-3">
          <label htmlFor="city">
            Deliver By City
            {/* Info Tooltip for Deliver by City */}
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="city-info">
                  Checking the city allows delivery across the entire city.
                </Tooltip>
              }
            >
              <Button variant="link" className="p-0 ms-2">
                <IoInformationCircleOutline />
              </Button>
            </OverlayTrigger>
          </label>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pincode</th>
                <th>City</th>
                <th>District</th>
                <th>State</th>
                <th>Deliverable</th>
              </tr>
            </thead>
            <tbody>
              {pincodes.length > 0 && (
                <tr>
                  <td>{pincodes[0].pincode.slice(0, 3)}</td>
                  <td>{pincodes[0].City}</td>
                  <td>{pincodes[0].District}</td>
                  <td>{pincodes[0].State}</td>
                  <td>
                    <FormCheck
                      type="switch"
                      checked={selectedCities.includes(
                        pincodes[0].pincode.slice(0, 3)
                      )}
                      onChange={(e) =>
                        locationChecked(e.target.checked, {
                          code: pincodes[0].pincode.slice(0, 3),
                          city: pincodes[0].City,
                          district: pincodes[0].District,
                          state: pincodes[0].State,
                        })
                      }
                    />
                  </td>
                </tr>
              )}

              {cites &&
                cites.map((city: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{city.code}</td>
                      <td>{city.city}</td>
                      <td>{city.district}</td>
                      <td>{city.state}</td>
                      <td>
                        <FormCheck
                          type="switch"
                          checked={selectedCities.includes(city.code)}
                          onChange={(e) =>
                            locationChecked(e.target.checked, {
                              code: city.code,
                              city: city.city,
                              district: city.district,
                              state: city.state,
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>

        <div className="table-responsive mt-3">
          <label htmlFor="location">
            Deliver By Location
            {/* Info Tooltip for Deliver by Location */}
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="location-info">
                  Checking specific locations restricts delivery to those areas
                  only.
                </Tooltip>
              }
            >
              <Button variant="link" className="p-0 ms-2">
                <IoInformationCircleOutline />
              </Button>
            </OverlayTrigger>
          </label>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pincode</th>
                <th>Area</th>
                <th>Street</th>
                <th>State</th>
                <th>City</th>
                <th>Deliverable</th>
              </tr>
            </thead>
            <tbody>
              {pincodes.map((pincode) => {
                const isChecked = selectedPincodes.includes(pincode._id);
                return (
                  <tr key={pincode._id}>
                    <td>{pincode.pincode}</td>
                    <td>{pincode.Name}</td>
                    <td>{pincode.Street}</td>
                    <td>{pincode.State}</td>
                    <td>{pincode.City}</td>
                    <td>
                      <FormCheck
                        type="switch"
                        id={`pincode-${pincode._id}`}
                        checked={isChecked}
                        onChange={(e) =>
                          pincodeChecked(e.target.checked, pincode._id)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DeliverableAddresses;
