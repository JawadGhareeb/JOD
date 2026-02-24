import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";

interface RTLContextType {
  isRTL: boolean;
  currentLanguage: string;
  rtlClass: string;
  ltrClass: string;
  flexDirection: string;
  textAlign: string;
  marginStart: string;
  marginEnd: string;
  paddingStart: string;
  paddingEnd: string;
  rtlStyles: {
    flexDirection: "row" | "row-reverse";
    textAlign: "left" | "right";
    marginStart: string;
    marginEnd: string;
    paddingStart: string;
    paddingEnd: string;
  };
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error("useRTL must be used within an RTLProvider");
  }
  return context;
};

export const RTLProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage] = useState<"ar">("ar");
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    setIsRTL(true);
  }, []);

  const contextValue: RTLContextType = {
    isRTL,
    currentLanguage,
    rtlClass: "rtl",
    ltrClass: "ltr",
    flexDirection: "flex-row-reverse",
    textAlign: "text-right",
    marginStart: "mr",
    marginEnd: "ml",
    paddingStart: "pr",
    paddingEnd: "pl",
    rtlStyles: {
      flexDirection: "row-reverse",
      textAlign: "right",
      marginStart: "marginRight",
      marginEnd: "marginLeft",
      paddingStart: "paddingRight",
      paddingEnd: "paddingLeft",
    },
  };

  return (
    <RTLContext.Provider value={contextValue}>{children}</RTLContext.Provider>
  );
};
