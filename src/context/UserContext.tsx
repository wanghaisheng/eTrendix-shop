import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import RestAPIService from "../services/RestAPIService";
import UserService from "../services/UserService";

// Define types for user data and user context
type UserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  pincode: string;
  address: string;
  area: string;
  landmark: string;
  userType: string;
  shop_name: string;
};

type UserContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  selectedLocation: any;
  setSelectedLocation: any;
  fetchCartCount: any;
  cartCount: number;
  locationString: any;
  setLocationString: any;
  errorString: string;
  setErrorString: any;
};

// Create user context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create user provider component
type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<UserData>(
    JSON.parse(localStorage.getItem("userData") || "{}")
  );

  const [selectedLocation, setSelectedLocation] = useState(
    JSON.parse(localStorage.getItem("selectedLocation") || "{}")
  );

  const [locationString, setLocationString] = useState("");

  const [errorString, setErrorString] = useState("");

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (Object.keys(selectedLocation).length === 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchLocation(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            console.log("Geolocation error:" + err.message);
            setErrorString("Geolocation error:" + err.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setErrorString("Geolocation is not supported by this browser.");
      }
    } else {
      const { Street, Name, City, State, pincode, Country } =
        selectedLocation || {};

      const addressParts = [
        Name,
        Street,
        City,
        State,
        pincode ? `Pin-${pincode}` : null,
        Country,
      ].filter((part) => part !== undefined && part !== null && part != ""); // Remove undefined and null values

      // Join the address parts with commas
      const addressString = addressParts.join(",");
      setLocationString(addressString);

      localStorage.setItem(
        "selectedLocation",
        JSON.stringify(selectedLocation)
      );
    }
  }, [selectedLocation]);

  const fetchLocation = async (lat: any, lng: any) => {
    const response = await RestAPIService.rev_geocode(lat, lng);

    if (response.status === 200) {
      setSelectedLocation(response.data.pincodeData);
    }
  };

  const fetchCartCount = async () => {
    var count = 0;
    try {
      const response = await UserService.fetchCartGroup();

      if (response.status === 200) {
        response.data.data.forEach((val: any) => {
          // setCartCount(val.count);
          count += val.count;
        });

        setCartCount(count);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (userData.id != 0 && userData.phone) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        selectedLocation,
        setSelectedLocation,
        fetchCartCount,
        cartCount,
        locationString,
        setLocationString,
        errorString,
        setErrorString,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create custom hook to access user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
