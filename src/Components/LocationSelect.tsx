import Addresses from "../pages/Profile/Addresses";
import PincodeSearch from "./PincodeSearch";
import { useUser } from "../context/UserContext";
import { TbCurrentLocation } from "react-icons/tb";
import { useEffect, useState } from "react";

const LocationSelect = ({
  showLocationSelectModal,
  setShowLocationSelectModal,
}: any) => {
  const { userData, setSelectedLocation, selectedLocation, errorString } =
    useUser();
  const [locationBtnLoader, setLocationBtnLoader] = useState<boolean>(false);

  useEffect(() => {
    if (selectedLocation._id || errorString != "") {
      setShowLocationSelectModal(false);
      setLocationBtnLoader(false);
    }
  }, [selectedLocation, errorString]);

  return (
    <>
      <div
        className={"overlay-sidebar" + (showLocationSelectModal ? " show" : "")}
        onClick={() => {
          setShowLocationSelectModal(false);
        }}
      ></div>

      <div
        className={`offcanvas offcanvas-bottom ${
          showLocationSelectModal && "show"
        } `}
        id="selectLocation"
        style={{ height: "80vh" }}
      >
        <div className="offcanvas-header">
          Select Your Location
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowLocationSelectModal(false);
            }}
          ></button>
        </div>

        <div className="offcanvas-body small">
          <div className="px-15">
            <PincodeSearch />
          </div>

          <button
            type="button"
            className="w-100 btn btn-outline"
            disabled={locationBtnLoader}
            onClick={() => {
              setSelectedLocation({});
              setLocationBtnLoader(true);
            }}
          >
            <TbCurrentLocation />{" "}
            {locationBtnLoader ? "Fetching..." : "Use current location"}
          </button>

          {/* address component */}
          {Object.keys(userData).length !== 0 && <Addresses />}
        </div>
      </div>
    </>
  );
};

export default LocationSelect;
