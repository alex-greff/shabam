import React from "react";
import { useModal } from "react-modal-hook";
import { HideModal, ShowModal } from "./types";

import AssertionModal, {
  Props as AssertionModalProps,
} from "@/components/modals/AssertionModal/AssertionModal";

export interface Options
  extends Omit<AssertionModalProps, "open" | "onExited" | "onAssertionClose"> {
  onAssertion?: () => boolean | Promise<boolean>;
}

export function useAssertionModal(
  component: () => JSX.Element,
  inputs?: any[],
  options?: Options
): [ShowModal, HideModal] {
  const [showModal, hideModal] = useModal(({ in: open, onExited }) => {
    const onAssertionCloseHandler = async () => {
      // No assertion close handler given, assume it returns true otherwise
      // run the assertion close handler and close iff it returns true
      if (!options?.onAssertion || await options.onAssertion()) {
        hideModal();
        return true;
      }
      return false;
    };

    return (
      <AssertionModal
        {...(options ?? {})}
        open={open}
        onExited={onExited}
        onAssertionClose={onAssertionCloseHandler}
      >
        {component()}
      </AssertionModal>
    );
  }, inputs);

  return [showModal, hideModal];
}
