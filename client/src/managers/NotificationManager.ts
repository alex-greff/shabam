import { toast } from "react-toastify";

export type NotificationType = "warn" | "success" | "info" | "error";

const DEFAULT_DURATION = 5000; // 5 seconds

export const showNotification = (
  type: NotificationType,
  message: string,
  duration = DEFAULT_DURATION
) => {
  return toast[type](message, {
    draggable: true,
    position: "bottom-center",
    autoClose: duration,
    className: "Notification",
    bodyClassName: "Notification__body",
    closeButton: false,
    hideProgressBar: true,
    closeOnClick: false,
  });
};

export const showErrorNotification = (
  message: string,
  duration = DEFAULT_DURATION
) => {
  return showNotification("error", message, duration);
};

export const showWarningNotification = (
  message: string,
  duration = DEFAULT_DURATION
) => {
  return showNotification("warn", message, duration);
};

export const showSuccessNotification = (
  message: string,
  duration = DEFAULT_DURATION
) => {
  return showNotification("success", message, duration);
};

export const showInfoNotification = (
  message: string,
  duration = DEFAULT_DURATION
) => {
  return showNotification("info", message, duration);
};
