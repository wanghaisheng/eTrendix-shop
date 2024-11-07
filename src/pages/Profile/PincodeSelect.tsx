import { useEffect, useState } from "react";
import RestAPIService from "../../services/RestAPIService";
import { useLocation, useNavigate } from "react-router-dom";
import PincodeResults from "../../Components/PincodeResults";

const PincodeSelect = () => {
  const [locationData, setLocationData] = useState<any>({});
  const [pincode, setPincode] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const lat = new URLSearchParams(location.search).get("lat");
  const lng = new URLSearchParams(location.search).get("lng");

  useEffect(() => {
    fetchLocation(lat, lng);
  }, []);

  const fetchLocation = async (lat: any, lng: any) => {
    const response = await RestAPIService.rev_geocode(lat, lng);

    if (response.status === 200) {
      setLocationData(response.data.pincodeData);
    }
  };

  useEffect(() => {
    if (locationData.pincode !== undefined) {
      setPincode(locationData.pincode);
    }
  }, [locationData]); // Added locationData as a dependency

  const updateArea = (value: any) => {
    // setPincode("");

    const data = {
      ...value,
      lat: lat,
      lng: lng,
    };
    // setSelectedArea(value);
    // setPincodeId(value.id);
    console.log(data);
    navigate("/addresses/new-address-location", { state: { data: data } });
  };

  return (
    <div>
      <section className="top-space pt-2">
        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control"
            id="pincode"
            placeholder="Pin Code"
            defaultValue={locationData?.pincode}
            onChange={(e) => {
              setPincode(e.target.value);
            }}
          />
          <label htmlFor="pincode">Pin Code</label>
          {pincode && <PincodeResults pincode={pincode} onClick={updateArea} />}
        </div>
      </section>
    </div>
  );
};

export default PincodeSelect;
