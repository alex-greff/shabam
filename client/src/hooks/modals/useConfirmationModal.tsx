import React from "react";
import { useModal } from "react-modal-hook";
import { HideModal, ShowModal } from "@/hooks/modals/types";

import ConfirmationModal, {
  Props as ConfirmationModalProps,
} from "@/components/modals/ConfirmationModal/ConfirmationModal";

export interface Options
  extends Omit<
    ConfirmationModalProps,
    "open" | "onExited" | "onAcceptClose" | "onCancelClose"
  > {
  onAccept?: () => boolean | Promise<boolean>;
  onCancel?: () => boolean | Promise<boolean>;
}

export function useConfirmationModal(
  component: () => JSX.Element,
  inputs?: any[],
  options?: Options
): [ShowModal, HideModal] {
  const [showModal, hideModal] = useModal(({ in: open, onExited }) => {
    const onAcceptCloseHandler = async () => {
      // No accept close handler given, assume it returns true otherwise
      // run the assertion close handler and close iff it returns true
      if (!options?.onAccept || await options.onAccept()) {
        hideModal();
        return true;
      }
      return false;
    };

    const onCancelCloseHandler = async () => {
      // No cancel close handler given, assume it returns true otherwise
      // run the assertion close handler and close iff it returns true
      if (!options?.onCancel || await options.onCancel()) {
        hideModal();
        return true;
      }
      return false;
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
