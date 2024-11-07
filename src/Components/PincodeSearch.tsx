import { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import PincodeResults from "./PincodeResults";

const PincodeSearch = () => {
  const { selectedLocation, setSelectedLocation, locationString } = useUser();
  const pincodeRef = useRef<HTMLInputElement>(null);
  const [pincode, setPincode] = useState<any>("");

  const updateArea = (area: any) => {
    setSelectedLocation(area);
    setPincode("");
  };

  const checkDelivery = () => {
    const pincodeValue = pincodeRef.current?.value;
    setPincode(pincodeValue);
  };

  return (
    <>
      <div className="check-delivery-section product-detail-box">
        <div className="pincode-form">
          <input
            ref={pincodeRef}
            className="form-control form-theme"
            placeholder="Pin code"
            defaultValue={selectedLocation?.pincode}
          />
          <a href="#0" onClick={checkDelivery}>
            Check
          </a>
        </div>
        <div className="service-section">
          {selectedLocation && (
            <p>
              <strong>Selected Area:</strong> {locationString}
            </p>
          )}
          {pincode && (
            <PincodeResults
              pincode={pincode}
              onClick={(area) => {
                updateArea(area);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PincodeSearch;
