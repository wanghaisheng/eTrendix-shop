import { createContext, useState, useContext } from "react";

type BodyContextType = {
  headerName: any;
  setHeaderName: any;
  showLoginForm: any;
  setShowLoginForm: any;
};

const BodyContext = createContext<BodyContextType | undefined>(undefined);

export const BodyProvider = ({ children }: any) => {
  const [headerName, setHeaderName] = useState<any>([]);
  const [showLoginForm, setShowLoginForm] = useState<any>(false);

  return (
    <BodyContext.Provider
      value={{ headerName, setHeaderName, showLoginForm, setShowLoginForm }}
    >
      {children}
    </BodyContext.Provider>
  );
};

export const useBody = () => {
  const context = useContext(BodyContext);
  if (!context) {
    throw new Error("useBody must be used within a BodyProvider");
  }
  return context;
};
