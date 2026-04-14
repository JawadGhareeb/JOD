import React from "react";
import { KeyboardAvoidingView, Platform, ViewProps } from "react-native";

type KeyboardAvoidingViewBehavior = "height" | "position" | "padding";

interface KeyboardAvoiderProps extends ViewProps {
  offsetIOS?: number;
  offsetAndroid?: number;
  behavior?: KeyboardAvoidingViewBehavior;
}

const KeyboardAvoider: React.FC<KeyboardAvoiderProps> = ({
  children,
  style,
  className,
  offsetIOS = 0,
  offsetAndroid = 0,
  behavior = Platform.OS === "ios" ? "padding" : "height",
  ...rest
}) => {
  return (
    <KeyboardAvoidingView
      behavior={behavior}
      keyboardVerticalOffset={Platform.OS === "ios" ? offsetIOS : offsetAndroid}
      style={[{ flex: 1 }, style]}
      className={className as string}
      contentContainerStyle={{ flex: 1 }}
      {...rest}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoider;
