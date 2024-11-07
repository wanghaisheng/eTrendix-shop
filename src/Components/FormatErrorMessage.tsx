const FormatErrorMessage = (errorObject: object) => {
  return (
    <ul className="list-group">
      {Object.entries(errorObject).map(([key, error]) => (
        <li key={key} className="list-group-item">
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </strong>
          {error.message}
        </li>
      ))}
    </ul>
  );
};

export default FormatErrorMessage;
