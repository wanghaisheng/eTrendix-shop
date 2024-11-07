import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
// import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import FormatErrorMessage from "../../Components/FormatErrorMessage";
import PincodeResults from "../../Components/PincodeResults";
import ReactSlickSlider from "react-slick";
import SellerImages from "./Components/SellerImages";

const schema = z.object({
  name: z.string().min(3),
  shop_name: z.string().min(3).optional(),
  pincode: z.string().min(3),
  address: z.string().min(3),
  landmark: z.string().optional(),
});

type profileForm = z.infer<typeof schema>;

interface userProps {
  user: {
    shop_name: string;
    name: string;
    email: string;
    userType: string;
    address: string;
    latitude: string;
    longitude: string;
    phone: string;
    delivery_type: string;
    minimumOrderPrice: string;
    deliveryCharge: string;
    images: string[];
  };

  addressData: {
    Name: string;
    pincode: string;
    Street: string;
    State: string;
    City: string;
    District: string;
    Country: string;
  };
}

const ProfileSetting = () => {
  const [pincode, setPincode] = useState("");
  const [selectedArea, setSelectedArea] = useState<any>({});
  const [focusArea, setFocusArea] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [me, setMe] = useState<userProps>();

  const { userData, setUserData } = useUser();

  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<profileForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (focusArea) {
      // document.getElementById("area").focus();
      const timer = setTimeout(() => {
        setFocusArea(false);
      }, 1000); // Change the delay time (in milliseconds) as needed
      return () => clearTimeout(timer);
    }
  }, [focusArea]);

  useEffect(() => {
    fetchUser();
  }, []);

  //   navigate("/login");

  const updateArea = (value: any) => {
    setSelectedArea(value);
    setPincode("");

    setFocusArea(true);
  };

  const updateProfile = (data: profileForm) => {
    const Toastid = toast.loading("Please wait...");

    setLoading(true);

    const submitData = { ...data, pincodeID: selectedArea._id };

    UserService.updateProfile(submitData)
      .then((response) => {
        const data = response.data;
        if (data.status === "success") {
          localStorage.setItem("userData", JSON.stringify(data.user)); // Save user details to localStorage
          setUserData(data.user);

          toast.update(Toastid, {
            render: data.message,
            type: "success",
            isLoading: false,
            draggable: true, // Make the toast draggable
            closeButton: true, // Show close button
            autoClose: 5000,
          });
        }
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
        } else {
          toast.update(Toastid, {
            render: "Error udpating profile",
            type: "error",
            isLoading: false,
            draggable: true, // Make the toast draggable
            closeButton: true, // Show close button
            autoClose: 5000,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUser = async () => {
    try {
      const response = await UserService.me();
      if (response.status === 200) {
        setMe(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (me?.user) {
      setSelectedArea(me.addressData);
      setValue("name", me.user.name);
      setValue("shop_name", me.user.shop_name);
      setValue("address", me.user.address);
      setValue("pincode", me?.addressData?.pincode || "");
    }
  }, [me]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(FormatErrorMessage(errors), { toastId: "0" });
    }
  }, [errors]);

  var settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // centerMode: true,
    // centerPadding: "30px",
    dots: true,
    height: "300px",
  };

  return (
    <>
      {me?.user.userType === "store" ? (
        <section className="top-space pt-0 px-15">
          <div className="home-slider slick-default theme-dots ratio_asos overflow-hidden">
            {me?.user?.images && me?.user?.images.length > 1 ? (
              <ReactSlickSlider {...settings}>
                {me?.user?.images.map((image: any, key: any) => (
                  <div key={key}>
                    <div className="home-img">
                      <img src={image} className="img-fluid bg-img" alt="" />
                    </div>
                  </div>
                ))}
              </ReactSlickSlider>
            ) : (
              me?.user?.images && (
                <div className="home-img d-flex justify-content-center align-items-center">
                  <img
                    src={me?.user?.images[0]}
                    className="img-fluid bg-img"
                    alt=""
                  />
                </div>
              )
            )}
          </div>

          <span className="edit-icon">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                setShowImagesModal(true);
              }}
            >
              <i className="iconly-Edit-Square icli"></i> Change Shop Photos
            </button>
          </span>
        </section>
      ) : (
        <section className="user-avtar-section top-space pt-0 px-15">
          <div className="home-slider slick-default theme-dots ratio_asos overflow-hidden">
            {me?.user?.images && me?.user?.images.length > 1 ? (
              <ReactSlickSlider {...settings}>
                {me?.user?.images.map((image: any, key: any) => (
                  <div key={key}>
                    <div className="home-img">
                      <img src={image} className="img-fluid bg-img" alt="" />
                    </div>
                  </div>
                ))}
              </ReactSlickSlider>
            ) : (
              me?.user?.images && (
                <div className="home-img d-flex justify-content-center align-items-center">
                  <img
                    src={me?.user?.images[0]}
                    className="img-fluid bg-img"
                    alt=""
                  />
                </div>
              )
            )}
          </div>

          <img
            src="/src/assets/images/user/1.png"
            className="img-fluid"
            alt=""
          />
          <span className="edit-icon">
            <i className="iconly-Edit-Square icli"></i>
          </span>
        </section>
      )}

      <section className="detail-form-section px-15">
        <h2 className="page-title mb-4">Personal Details</h2>
        <form
          onSubmit={handleSubmit((data) => {
            updateProfile(data);
          })}
        >
          <div className="form-floating mb-4">
            <input
              {...register("shop_name")}
              type="text"
              className="form-control"
              id="shopName"
              placeholder="Shop Name"
            />
            <label htmlFor="shopName">Shop Name</label>
          </div>

          <div className="form-floating mb-4">
            <input
              {...register("name")}
              type="text"
              className="form-control"
              id="one"
              placeholder="Name"
            />
            <label htmlFor="one">Name</label>
          </div>
          <div className="form-floating mb-4">
            <input
              {...register("address")}
              type="text"
              className="form-control"
              id="address"
              placeholder="Address"
            />
            <label htmlFor="address">Address </label>
          </div>

          <div className="form-floating mb-4">
            <input
              {...register("pincode")}
              type="text"
              className="form-control"
              id="Pincode"
              placeholder="Pincode"
              onChange={(e) => {
                setPincode(e.target.value);
              }}
            />
            <label htmlFor="Address">Pincode</label>

            {/* address data  */}
            {pincode && (
              <PincodeResults pincode={pincode} onClick={updateArea} />
            )}
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="location"
              placeholder=""
              defaultValue={selectedArea?.Name}
              disabled={true}
            />
            <label htmlFor="location">Location Name</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="area"
              placeholder="Area"
              defaultValue={selectedArea?.Street}
              disabled={true}
            />
            <label htmlFor="area">Area, Street</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="City"
              placeholder="City"
              defaultValue={selectedArea?.City}
              disabled={true}
            />
            <label htmlFor="City">City</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="State"
              placeholder="State"
              defaultValue={selectedArea?.State}
              disabled={true}
            />
            <label htmlFor="State">State</label>
          </div>

          <div className="form-floating mb-4">
            <input
              {...register("landmark")}
              type="text"
              className="form-control"
              id="landmark"
              placeholder="Landmark"
              defaultValue={userData?.landmark}
            />
            <label htmlFor="landmark">Landmark</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </section>
      <div className="divider"></div>
      <section className="detail-form-section pt-0 px-15">
        <form>
          <div className="form-floating mb-4">
            <input
              disabled
              type="number"
              className="form-control"
              id="six"
              defaultValue={userData?.phone}
              placeholder="Mobile Number"
            />
            <label htmlFor="six">Mobile Number</label>
          </div>
          <div className="form-floating mb-4">
            <input
              disabled
              type="text"
              className="form-control"
              id="five"
              placeholder="email"
              defaultValue={userData?.email}
            />
            <label htmlFor="five">email</label>
          </div>
        </form>
      </section>

      {me?.user && me?.user.userType == "store" && (
        <SellerImages
          user={me?.user}
          showImagesModal={showImagesModal}
          setShowImagesModal={setShowImagesModal}
          fetchUser={fetchUser}
        />
      )}
    </>
  );
};

export default ProfileSetting;
