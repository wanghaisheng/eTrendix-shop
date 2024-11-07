import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PincodeResults from "../../Components/PincodeResults";
import { toast } from "react-toastify";
import FormatErrorMessage from "../../Components/FormatErrorMessage";
import UserService from "../../services/UserService";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
// import RestAPIService from "../../services/RestAPIService";

const schema = z.object({
  name: z.string().min(3),
  pincode: z.string().min(3),
  area: z.string().min(3),
  address: z.string().min(3),
  landmark: z.string(),
  city: z.string(),
  state: z.string(),
  phone: z.string().regex(/^\d{10}$/),
  addressType: z.string(),
});
type addressForm = z.infer<typeof schema>;

const NewAddress = () => {
  const [pincode, setPincode] = useState("");
  const [pincodeId, setPincodeId] = useState("");
  const [selectedArea, setSelectedArea] = useState<any>({});
  const [focusArea, setFocusArea] = useState(false);
  const { setSelectedLocation } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<addressForm>({ resolver: zodResolver(schema) });

  const updateArea = (value: any) => {
    setPincode("");

    setFocusArea(true);
    setSelectedArea(value);
    setPincodeId(value.id);
  };

  const handleFormSubmit = (data: any) => {
    // Perform any necessary updates before submitting the form
    updateAddress(data);
  };

  const updateAddress = (address: any) => {
    const Toastid = toast.loading("Please wait...");

    const isDefault =
      (document.getElementById("default") as HTMLInputElement)?.checked ??
      false;
    const addressData = {
      ...address,
      default: isDefault,
      pincode_id: pincodeId,
    };

    UserService.addAddress(addressData)
      .then((res) => {
        const data = res.data;
        const locationData = data.locationData;
        localStorage.setItem("selectedLocation", JSON.stringify(locationData)); // Save user details to localStorage
        setSelectedLocation(locationData);

        toast.update(Toastid, {
          render: data.message,
          type: "success",
          isLoading: false,
          draggable: true, // Make the toast draggable
          closeButton: true, // Show close button
          autoClose: 5000,
        });
        navigate("/addresses", {
          state: { toastMessage: data.message, toastType: "success" },
        });
      })
      .catch((error) => {
        if (error.response.data.message) {
          toast.update(Toastid, {
            render: error.response.data.message,
            type: "error",
            isLoading: false,
            draggable: true, // Make the toast draggable
            closeButton: true, // Show close button
            autoClose: 5000,
          });
        }
      });
  };

  useEffect(() => {
    if (focusArea) {
      // document.getElementById("area").focus();
      // document.getElementById("state").focus();
      // document.getElementById("city").focus();
      const timer = setTimeout(() => {
        setFocusArea(false);
      }, 1000); // Change the delay time (in milliseconds) as needed
      return () => clearTimeout(timer);
    }
  }, [focusArea]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(FormatErrorMessage(errors), { toastId: "0" });
    }
  }, [errors]);
  return (
    <>
      <section className="top-space pt-2">
        <form id="addressForm" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="address-form-section px-15">
            <div className="form-floating mb-4">
              <input
                {...register("name")}
                type="text"
                className="form-control"
                id="one"
                placeholder="Full Name"
              />
              <label htmlFor="one">Full Name</label>
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("phone")}
                type="number"
                className="form-control"
                id="two"
                placeholder="Mobile Number"
              />
              <label htmlFor="two">Mobile Number</label>
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("pincode")}
                type="text"
                className="form-control"
                id="three"
                placeholder="Pin Code"
                onChange={(e) => {
                  setPincode(e.target.value);
                }}
              />
              <label htmlFor="three">Pin Code</label>
              {/* address data  */}
              {pincode && (
                <PincodeResults pincode={pincode} onClick={updateArea} />
              )}
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("area")}
                type="text"
                className="form-control"
                id="area"
                placeholder="area, colony, street"
                value={selectedArea?.Name}
                autoFocus={focusArea}
                readOnly={true}
              />
              <label htmlFor="area">area, colony, street</label>
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("address")}
                type="text"
                className="form-control"
                id="four"
                placeholder="flat, house No., building.."
              />
              <label htmlFor="four">flat, house No., building..</label>
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("landmark")}
                type="text"
                className="form-control"
                id="six"
                placeholder="landmark"
              />
              <label htmlFor="six">landmark</label>
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("city")}
                type="text"
                className="form-control"
                id="city"
                placeholder="town/city"
                value={selectedArea?.District}
                autoFocus={focusArea}
                readOnly={true}
              />
              <label htmlFor="city">town/city</label>
            </div>
            <div className="form-floating mb-4">
              <input
                {...register("state")}
                type="text"
                className="form-control"
                id="state"
                placeholder="State"
                value={selectedArea?.State}
                autoFocus={focusArea}
                readOnly={true}
              />
              <label htmlFor="state">state/province/region</label>
            </div>
          </div>
          <div className="divider"></div>

          <div className="type-address px-15">
            <h2 className="page-title">Type of address</h2>
            <div className="d-flex">
              <div className="me-3 d-flex align-items-center mb-2">
                <input
                  className="radio_animated"
                  type="radio"
                  {...register("addressType")}
                  id="Home"
                  value="home"
                  defaultChecked
                />
                <label htmlFor="Home">Home</label>
              </div>
              <div className="me-3 d-flex align-items-center mb-2">
                <input
                  className="radio_animated"
                  type="radio"
                  {...register("addressType")}
                  id="office"
                  value="office"
                />
                <label htmlFor="office">Office</label>
              </div>
              <div className="d-flex align-items-center mb-2">
                <input
                  className="radio_animated"
                  type="radio"
                  {...register("addressType")}
                  id="others"
                  value="others"
                />
                <label htmlFor="others">Others</label>
              </div>
            </div>
            <div className="checkbox_animated">
              <div className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  name="default"
                  id="default"
                  value="yes"
                  defaultChecked
                />
                <label htmlFor="default">make default address </label>
              </div>
            </div>
          </div>
          <div className="cart-bottom row">
            <div>
              <div className="left-content col-5">
                <a href="#" className="title-color">
                  RESET
                </a>
              </div>
              <button
                type="submit"
                className="btn btn-solid col-7 text-uppercase"
              >
                Add Address
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="panel-space"></section>
    </>
  );
};

export default NewAddress;
