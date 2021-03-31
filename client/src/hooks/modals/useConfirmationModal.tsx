import React from "react";
import { useModal } from "react-modal-hook";
import { HideModal, ShowModal } from "./types";

import ConfirmationModal, {
  Props as ConfirmationModalProps,
} from "@/components/modals/ConfirmationModal/ConfirmationModal";

export interface Options
  extends Omit<
    ConfirmationModalProps,
    "open" | "onExited" | "onAcceptClose" | "onCancelClose"
  > {
  onAccept?: () => boolean; // Allow the confirmation to close
  onCancel?: () => boolean; // Allow the confirmation to close
}

export function useConfirmationModal(
  component: () => JSX.Element,
  inputs?: any[],
  options?: Options
): [ShowModal, HideModal] {
  const [showModal, hideModal] = useModal(({ in: open, onExited }) => {
    const onAcceptCloseHandler = () => {
      // No accept close handler given, assume it returns true otherwise
      // run the assertion close handler and close iff it returns true
      if (!options?.onAccept || options.onAccept()) {
        hideModal();
      }
    };

    const onCancelCloseHandler = () => {
      // No cancel close handler given, assume it returns true otherwise
      // run the assertion close handler and close iff it returns true
      if (!options?.onCancel || options.onCancel()) {
        hideModal();
      }
    };

    return (
      <ConfirmationModal
        {...(options ?? {})}
        open={open}
        onExited={onExited}
        onAcceptClose={onAcceptCloseHandler}
        onCancelClose={onCancelCloseHandler}
      >
        {component()}
      </ConfirmationModal>
    );
  }, inputs);

  return [showModal, hideModal];
}
