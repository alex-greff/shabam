import React from "react";
import BaseModal, {
  Props as BaseModalProps,
} from "@/components/modals/BaseModal/BaseModal";
import { useModal } from "react-modal-hook";
import { HideModal, ShowModal } from "./types";

export type Options = Omit<
  BaseModalProps,
  "open" | "onExited" | "onRequestClose"
>;

export function useBaseModal(
  component: () => JSX.Element,
  inputs?: any[],
  baseModalOptions?: Options
): [ShowModal, HideModal] {
  const [showModal, hideModal] = useModal(({ in: open, onExited }) => {
    return (
      <BaseModal
        {...(baseModalOptions ?? {})}
        open={open}
        onExited={onExited}
        onRequestClose={hideModal}
      >
        {component()}
      </BaseModal>
    );
  }, inputs);

  return [showModal, hideModal];
}
