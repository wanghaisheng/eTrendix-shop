import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  ProgressBar,
  InputGroup,
  Spinner,
  Table,
} from "react-bootstrap";
import SellerService from "../../services/SellerService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PincodeResults from "../../Components/PincodeResults";
import circleGIF from "../../assets/images/check-circle.gif";
import { Link } from "react-router-dom";
import designSVG from "../../assets/images/design.svg";
import logoPNG from "../../assets/images/logo/android-chrome-192x192.png";

interface categories {
  _id: string;
  name: string;
}

// Zod schema for validation
const sellerOnboardSchema = z.object({
  contactNo: z.string().min(10, "Contact number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  shopName: z.string().min(1, "Shop name is required"),
  gstin: z
    .string()
    .min(15, "GSTIN must be 15 characters")
    .max(15, "GSTIN must be 15 characters"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  address: z.string().min(1, "Address is required"),
  category: z.string().nonempty("Please select a category"),
  description: z.string().optional(),
});

const SellerOnBoard = () => {
  const [step, setStep] = useState(1);
  const [gstinLoader, setGstinLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gstinData, setGstinData] = useState<any>({});
  const [storeCategories, setStoreCategories] = useState<categories[]>();
  const [pincode, setPincode] = useState("");
  const [selectedArea, setSelectedArea] = useState<any>([]);
  const [backErrors, setBackErrors] = useState<number>(0); // Track errors on the back button

  // Initialize useForm with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(sellerOnboardSchema),
  });

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const countErrorsForCurrentStep = () => {
    let stepErrors = 0;

    if (errors.contactNo) stepErrors++;
    if (errors.email) stepErrors++;

    if (errors.shopName) stepErrors++;
    if (errors.gstin) stepErrors++;

    if (errors.pincode) stepErrors++;
    if (errors.address) stepErrors++;

    if (errors.category) stepErrors++;
    if (errors.description) stepErrors++;

    return stepErrors;
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    const errorCount = countErrorsForCurrentStep();
    setBackErrors(errorCount);
  }, [errors]);

  const getProgress = () => (step / 4) * 100;

  const checkGSTIN = async () => {
    if (watch("gstin") === "") {
      toast.error("Please enter a GSTIN");
      return;
    }

    setGstinLoader(true);
    try {
      const response = await SellerService.checkGSTIN(watch("gstin"));
      if (response.data.status === "success") {
        setGstinData(response.data.data);
      }
      setGstinLoader(false);
    } catch (error: any) {
      setGstinLoader(false);
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      }
    }
  };

  const getStoreCategories = async () => {
    try {
      const response = await SellerService.getStoreCategories();
      if (response.status === 200) {
        setStoreCategories(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getStoreCategories();
  }, []);

  const updateArea = (value: any) => {
    setSelectedArea(value);
    setPincode("");
  };

  const pincodeVal = watch("pincode");

  useEffect(() => {
    setPincode(pincodeVal);
  }, [pincodeVal]);

  const onSubmit = async (data: any) => {
    const submittedData = {
      ...data,
      pincodeId: selectedArea._id,
      gstinData: gstinData,
    };
    const Toastid = toast.loading("Please wait...");

    try {
      const response = await SellerService.saveEnquiryData(submittedData);

      if (response.status === 201) {
        reset();
        setSuccess(true);
        toast.update(Toastid, {
          render: "Thank you for submitting your details!",
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log("Error: ", error);

      toast.update(Toastid, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        draggable: true, // Make the toast draggable
        closeButton: true, // Show close button
        autoClose: 5000,
      });
    }
  };

  return (
    <div>
      <img src={designSVG} className="img-fluid design-top" alt="" />

      <div className="topbar-section">
        <Link to="/">
          <img src={logoPNG} className="img-fluid" alt="" />
        </Link>
      </div>

      {success ? (
        <>
          <section className="order-success-section px-15   xl-space">
            <div>
              <img src={circleGIF} className="img-fluid" alt="" />
              <h1>Thank you for submitting your details!</h1>
              <h2>
                Our team will reach out to you shortly to verify your
                information. We appreciate your patience and look forward to
                assisting you.
              </h2>
            </div>
          </section>
        </>
      ) : (
        <div className="p-3 shadow-sm mx-auto">
          <h3 className="mb-4 text-center">Seller Onboarding Form</h3>

          <ProgressBar
            now={getProgress()}
            className="mb-4"
            label={`Step ${step} of 4`}
          />

          {/* Form content based on the current step */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <>
                <Form.Group as={Row} controlId="contactNo">
                  <Col xs="12" sm="10">
                    <div className="form-floating mb-4">
                      <Form.Control
                        type="text"
                        placeholder="Enter contact number"
                        className="mb-3"
                        {...register("contactNo")}
                      />
                      <label>Contact No</label>

                      {errors.contactNo && (
                        <p className="text-danger">
                          {String(errors.contactNo.message)}
                        </p>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="email">
                  <Col xs="12" sm="10">
                    <div className="form-floating mb-4">
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        className="mb-3"
                        {...register("email")}
                      />
                      <label>Email</label>
                      {errors.email && (
                        <p className="text-danger">
                          {String(errors.email.message)}
                        </p>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="shopName">
                  <Col xs="12" sm="10">
                    <div className="form-floating mb-4">
                      <Form.Control
                        type="text"
                        placeholder="Enter shop name"
                        className="mb-3"
                        {...register("shopName")}
                      />
                      <label>Shop Name</label>
                      {errors.shopName && (
                        <p className="text-danger">
                          {String(errors.shopName.message)}
                        </p>
                      )}
                    </div>
                  </Col>
                </Form.Group>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Group as={Row} controlId="gstin">
                  <Col xs="12" sm="10">
                    <InputGroup className="form-floating mb-4">
                      <Form.Control
                        placeholder="Enter GSTIN"
                        aria-label="Enter GSTIN"
                        aria-describedby="basic-addon2"
                        {...register("gstin")}
                      />
                      <label>GSTIN</label>

                      <InputGroup.Text id="basic-addon2">
                        <Button
                          onClick={() => {
                            checkGSTIN();
                          }}
                        >
                          {gstinLoader && (
                            <Spinner animation="grow" role="status" size="sm">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          )}
                          {!gstinLoader ? "Check" : "Checking..."}
                        </Button>
                      </InputGroup.Text>
                    </InputGroup>

                    {errors.gstin && (
                      <p className="text-danger">
                        {String(errors.gstin.message)}
                      </p>
                    )}
                  </Col>
                </Form.Group>

                {/* GSTIN Data Table */}

                <Col xs={12} sm={10}>
                  <Table striped="columns" bordered hover size="sm">
                    <tbody>
                      {gstinData.gstin && (
                        <tr>
                          <td>GSTIN</td>
                          <td>{gstinData.gstin}</td>
                        </tr>
                      )}

                      {gstinData.legal_name && (
                        <tr>
                          <td>Legal Name</td>
                          <td>{gstinData.legal_name}</td>
                        </tr>
                      )}

                      {gstinData.trade_name && (
                        <tr>
                          <td>Trade Name</td>
                          <td>{gstinData.trade_name}</td>
                        </tr>
                      )}

                      {gstinData.status && (
                        <tr>
                          <td>Status</td>
                          <td>{gstinData.status}</td>
                        </tr>
                      )}

                      {gstinData.primary_address && (
                        <tr>
                          <td>Primary Address</td>
                          <td>{gstinData.primary_address}</td>
                        </tr>
                      )}

                      {gstinData.registration_date && (
                        <tr>
                          <td>Registration Date</td>
                          <td>{gstinData.registration_date}</td>
                        </tr>
                      )}

                      {gstinData.constitution && (
                        <tr>
                          <td>Constitution</td>
                          <td>{gstinData.constitution}</td>
                        </tr>
                      )}

                      {gstinData.state_jurisdiction && (
                        <tr>
                          <td>State Jurisdiction</td>
                          <td>{gstinData.state_jurisdiction}</td>
                        </tr>
                      )}

                      {gstinData.tax_payer_type && (
                        <tr>
                          <td>TAX payer type</td>
                          <td>{gstinData.tax_payer_type}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </>
            )}

            {step === 3 && (
              <>
                <Form.Group as={Row} controlId="pincode">
                  <Col xs="12" sm="10">
                    <div className="form-floating mb-4">
                      <Form.Control
                        type="text"
                        placeholder="Enter pincode"
                        className="mb-3"
                        {...register("pincode")}
                      />
                      <label>Pincode</label>

                      {errors.pincode && (
                        <p className="text-danger">
                          {String(errors.pincode.message)}
                        </p>
                      )}

                      {pincode && (
                        <PincodeResults
                          pincode={pincode}
                          onClick={updateArea}
                        />
                      )}

                      {selectedArea.pincode && (
                        <Table striped="columns" bordered hover size="sm">
                          <tbody>
                            {selectedArea.pincode && (
                              <tr>
                                <td>Pincode</td>
                                <td>{selectedArea.pincode}</td>
                              </tr>
                            )}
                            {selectedArea.Street && (
                              <tr>
                                <td>Street/Road</td>
                                <td>{selectedArea.Street}</td>
                              </tr>
                            )}

                            {selectedArea.Name && (
                              <tr>
                                <td>Name</td>
                                <td>{selectedArea.Name}</td>
                              </tr>
                            )}

                            {selectedArea.City && (
                              <tr>
                                <td>City</td>
                                <td>{selectedArea.City}</td>
                              </tr>
                            )}

                            {selectedArea.State && (
                              <tr>
                                <td>State</td>
                                <td>{selectedArea.State}</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="address">
                  <Col xs="12" sm="10">
                    <div className="form-floating mb-4">
                      <Form.Control
                        type="text"
                        placeholder="Enter shop address"
                        className="mb-3"
                        {...register("address")}
                      />
                      <label>Shop Address</label>
                      {errors.address && (
                        <p className="text-danger">
                          {String(errors.address.message)}
                        </p>
                      )}
                    </div>
                  </Col>
                </Form.Group>
              </>
            )}

            {step === 4 && (
              <>
                <Form.Group as={Row} controlId="category">
                  <Col xs="12" sm="10">
                    <div className="form-floating mb-4">
                      <Form.Select size="sm" {...register("category")}>
                        <option value="">Please select a category</option>
                        {storeCategories?.map((category, key: number) => (
                          <option value={category._id} key={key}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                      <label>Category</label>

                      {errors.category && (
                        <p className="text-danger">
                          {String(errors.category.message)}
                        </p>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="description">
                  <Col xs="12" sm="10">
                    <div className="mb-4">
                      <label>Description</label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe your shop"
                        className="mb-3"
                        {...register("description")}
                      />

                      {errors.description && (
                        <p className="text-danger">
                          {String(errors.description.message)}
                        </p>
                      )}
                    </div>
                  </Col>
                </Form.Group>
              </>
            )}

            {/* Navigation buttons */}
            <div className="  fixed-bottom text-center p-3 bg-white">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary me-2 position-relative"
                  onClick={prevStep}
                >
                  Back{" "}
                  {backErrors > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                      {backErrors}
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  )}
                </button>
              )}
              {step < 4 && (
                <Button className="me-2" variant="primary" onClick={nextStep}>
                  Next
                </Button>
              )}
              {step === 4 && (
                <Button variant="success" type="submit">
                  Submit
                </Button>
              )}

              <div className="bottom-detail text-center mt-3">
                <h4 className="content-color">
                  By continuing, you acknowledge that you have read and agree to
                  our{" "}
                  <Link
                    className="title-color text-decoration-underline"
                    to="/terms-condition"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="title-color text-decoration-underline"
                    to="/privacy-policy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </h4>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SellerOnBoard;
