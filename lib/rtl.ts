import { I18nManager } from "react-native";

//may be in the future will delete it but at the moment it is used:

// Check if the app is currently in RTL mode
export const isRTL = (): boolean => {
  return I18nManager.isRTL;
};

// Force RTL mode (should be called once at app startup)
export const enableRTL = (): void => {
  I18nManager.forceRTL(true);
};

// Force LTR mode (if needed)
export const enableLTR = (): void => {
  I18nManager.forceRTL(false);
};

// Get the appropriate margin/padding direction
export const getDirectionalStyle = (left: any, right: any) => {
  return isRTL()
    ? { marginRight: left, marginLeft: right }
    : { marginLeft: left, marginRight: right };
};

// Get the appropriate positioning style
export const getPositionStyle = (left: any, right: any) => {
  return isRTL() ? { right: left, left: right } : { left: left, right: right };
};

// Get the appropriate flex direction
export const getFlexDirection = (direction: "row" | "row-reverse" = "row") => {
  if (direction === "row") {
    return isRTL() ? "row-reverse" : "row";
  }
  return isRTL() ? "row" : "row-reverse";
};
