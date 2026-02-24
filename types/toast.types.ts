import React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastAnimation =
  | "fade"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "scale";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  animation?: ToastAnimation;
  autoHide?: boolean;
  showCloseButton?: boolean;
  customIcon?: React.ReactNode;
  onClose?: () => void;
  onPress?: () => void;
}

export interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  clearToasts: () => void;
}

export interface ToastStyle {
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
  icon: React.ReactNode;
}
