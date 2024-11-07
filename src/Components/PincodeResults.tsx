import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import UserService from "../services/UserService";

interface Props {
  onClick: (val: any) => void;
  pincode: string;
}

const PincodeResults = ({ onClick, pincode }: Props) => {
  const [suggestions, setSuggestions] = useState<any[]>([]); // Ensure suggestions are always an array
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  let typingTimer: any | undefined;

  const getAddress = (value: any) => {
    setShowPlaceholder(true);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      if (value.trim() !== "") {
        fetchData(value); // Pass value directly to fetchData
      } else {
        console.log(1);
        setSuggestions([]); // If the input is empty, reset suggestions
      }
    }, 1000); // Adjust the delay time as needed
  };

  useEffect(() => {
    getAddress(pincode);
  }, [pincode]);

  const fetchData = async (pincode: any) => {
    try {
      const response = await UserService.fetchPincode(pincode);

      if (
        response.status === 200 &&
        response.data &&
        Array.isArray(response.data.pincodes)
      ) {
        setSuggestions(response.data.pincodes);
      } else {
        // console.log(2);
        // setSuggestions([]); // Ensure suggestions are reset to an empty array on failure or empty data
      }
      setShowPlaceholder(false);
    } catch (error) {
      console.error(error);
      console.log(3);

      setSuggestions([]); // Reset suggestions on error
      setShowPlaceholder(false);
    }
  };

  return (
    <>
      {showPlaceholder && (
        <div className="card-text placeholder-glow">
          <p>
            <span className="placeholder col-7"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-8"></span>
          </p>
        </div>
      )}

      {suggestions.length === 0 && !showPlaceholder && (
        <div className="alert alert-warning" role="alert">
          No Data
        </div>
      )}

      <ListGroup variant="flush">
        {suggestions.map((suggestion: any, index: number) => (
          <ListGroup.Item
            action
            key={index}
            onClick={() => onClick(suggestion)} // Correct this to pass the clicked suggestion
          >
            {suggestion.Street &&
              suggestion.Street !== "NA" &&
              `${suggestion.Street}`}
            {suggestion.Street &&
              suggestion.Street !== "NA" &&
              suggestion.Name &&
              ", "}
            {suggestion.Name && `${suggestion.Name}`}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default PincodeResults;
