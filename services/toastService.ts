import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  autoHide?: boolean;
  onPress?: () => void;
}

class ToastService {
  private showToast(options: ToastOptions): void {
    Toast.show({
      type: options.type,
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      autoHide: options.autoHide !== false,
      onPress: options.onPress,
    });
  }

  success(title: string, message: string, duration?: number): void {
    this.showToast({
      type: "success",
      title,
      message,
      duration,
    });
  }

  error(title: string, message: string, duration?: number): void {
    this.showToast({
      type: "error",
      title,
      message,
      duration,
    });
  }

  warning(title: string, message: string, duration?: number): void {
    this.showToast({
      type: "warning",
      title,
      message,
      duration,
    });
  }

  info(title: string, message: string, duration?: number): void {
    this.showToast({
      type: "info",
      title,
      message,
      duration,
    });
  }

  hide(): void {
    Toast.hide();
  }
}

export const toastService = new ToastService();
