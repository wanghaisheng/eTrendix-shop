import React, { useEffect, useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabPane,
  Row,
  Col,
  Card,
  CardBody,
  TabContent,
  Spinner,
} from "react-bootstrap";
import SellerService from "../../services/SellerService";
import FreeDeliveryForm from "./FreeDeliveryForm";
import PaidDeliveryForm from "./PaidDeliveryForm";
import { toast } from "react-toastify";
import CustomLocationCharge from "./CustomLocationCharge";
import UserService from "../../services/UserService";

const DeliveryCharges: React.FC = () => {
  const [deliveryType, setDeliveryType] = useState<number>(0);
  const [tab, setTab] = useState<number>(1);
  const [userData, setUserData] = useState<any>(null); // Adjust the type as per the actual userData
  const [isLoading, setIsLoading] = useState<boolean>(true); // New state for loading

  const fetchUserData = async () => {
    try {
      const response = await UserService.me();
      if (response.status === 200) {
        setUserData(response.data);
        setDeliveryType(response.data.user.delivery_type);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false); // Stop the loading once data is fetched
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateDeliveryType = async (type: boolean) => {
    const ToastID = toast.loading("Please wait...");

    try {
      const response = await SellerService.updateDeliveryType(type);
      if (response.data.status === "success") {
        setDeliveryType(type ? 1 : 0);
        toast.update(ToastID, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          draggable: true,
          closeButton: true,
          autoClose: 1000,
        });
      }
    } catch (error: any) {
      console.error("Error updating delivery type:", error);
      toast.update(ToastID, {
        render: error.response.data.message,
        type: "error",
        isLoading: false,
        draggable: true,
        closeButton: true,
        autoClose: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="px-15 top-space">
      <Nav justify variant="pills" className="mb-3">
        <NavItem>
          <NavLink onClick={() => setTab(1)} active={tab === 1}>
            Charges
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={() => setTab(2)} active={tab === 2}>
            Custom Location Charges
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent>
        <TabPane eventKey={1} active={tab === 1}>
          <Row>
            <Col xs={12}>
              <Card className="mb-2">
                <CardBody>
                  <div className="content toggle-sec w-100">
                    <div>
                      <h4>Paid Delivery</h4>
                    </div>
                    <div className="button toggle-btn ms-auto">
                      <input
                        id="deliveryToggle"
                        type="checkbox"
                        className="checkbox"
                        checked={!!deliveryType} // Toggle state between Free and Paid
                        onChange={() => updateDeliveryType(!deliveryType)} // Invert current delivery type
                      />
                      <div className="knobs">
                        <span></span>
                      </div>
                      <div className="layer"></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card className="mb-4">
                <CardBody>
                  {!deliveryType ? (
                    <FreeDeliveryForm
                      userData={userData}
                      fetchUserData={fetchUserData}
                    />
                  ) : (
                    <PaidDeliveryForm
                      userData={userData}
                      fetchUserData={fetchUserData}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane eventKey={2} active={tab === 2}>
          <Row>
            <Col xs={12}>
              <Card className="mb-4">
                <CardBody>
                  <CustomLocationCharge />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default DeliveryCharges;
