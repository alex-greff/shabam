import React from "react";
import {
  useAssertionModal,
  Options as UseAssertionModalOptions,
} from "@/hooks/modals/useAssertionModal";

import MessageConfirmationTemplate from "@/components/modals/templates/MessageConfirmationTemplate/MessageConfirmationTemplate";

export interface Options extends UseAssertionModalOptions {}

export function useMessageConfirmationModal(
  title: string,
  message: string,
  options?: Options
) {
  return useAssertionModal(
    () => <MessageConfirmationTemplate title={title} message={message} />,
    [title, message],
    options
  );
}
