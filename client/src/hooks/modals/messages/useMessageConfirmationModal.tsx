import React from "react";
import {
  useConfirmationModal,
  Options as UseConfirmationModalOptions,
} from "@/hooks/modals/useConfirmationModal";

import MessageConfirmationTemplate from "@/components/modals/templates/MessageConfirmationTemplate/MessageConfirmationTemplate";

export interface Options extends UseConfirmationModalOptions {}

export function useMessageConfirmationModal(
  title: string,
  message: string,
  options?: Options
) {
  return useConfirmationModal(
    () => <MessageConfirmationTemplate title={title} message={message} />,
    [title, message],
    options
  );
}
