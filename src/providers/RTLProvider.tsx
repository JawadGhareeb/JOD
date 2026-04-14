import React, { createContext, useContext } from "react";

type RTLContextValue = {
  isRTL: boolean;
  currentLanguage: "ar" | "en";
};

const RTLContext = createContext<RTLContextValue>({
  isRTL: true,
  currentLanguage: "ar",
});

export const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RTLContext.Provider value={{ isRTL: true, currentLanguage: "ar" }}>
      {children}
    </RTLContext.Provider>
  );
};

export const useRTL = () => useContext(RTLContext);
