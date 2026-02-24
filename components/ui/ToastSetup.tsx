import React from "react";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { CustomToast } from "./CustomToast";

interface ToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  hide?: () => void;
}

export const ToastSetup: React.FC = () => {
  return (
    <Toast
      config={{
        success: (props: ToastProps) => (
          <CustomToast
            type="success"
            text1={props.text1 || ""}
            text2={props.text2 || ""}
            onPress={props.onPress}
            onHide={props.hide}
          />
        ),
        error: (props: ToastProps) => (
          <CustomToast
            type="error"
            text1={props.text1 || ""}
            text2={props.text2 || ""}
            onPress={props.onPress}
            onHide={props.hide}
          />
        ),
        warning: (props: ToastProps) => (
          <CustomToast
            type="warning"
            text1={props.text1 || ""}
            text2={props.text2 || ""}
            onPress={props.onPress}
            onHide={props.hide}
          />
        ),
        info: (props: ToastProps) => (
          <CustomToast
            type="info"
            text1={props.text1 || ""}
            text2={props.text2 || ""}
            onPress={props.onPress}
            onHide={props.hide}
          />
        ),
      }}
    />
  );
};
