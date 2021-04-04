import React from "react";
import { useModal } from "react-modal-hook";
import { HideModal, ShowModal } from "@/hooks/modals/types";

import CatalogConfigurationModal, {
  Props as CatalogConfigurationModalProps,
  CatalogItemData,
} from "@/components/modals/catalog/CatalogConfigureModal/CatalogConfigureModal";

export interface Options
  extends Omit<
    CatalogConfigurationModalProps,
    "onAcceptClose" | "onCancelClose"
  > {
  onAccept?: (data: CatalogItemData) => boolean;
  onCancel?: (data: CatalogItemData) => boolean;
}

export function useCatalogConfigureModal(
  options?: Partial<Options>
): [ShowModal] {
  const [showModal, hideModal] = useModal(({ in: open, onExited }) => {
    const onAcceptCloseHandler = (data: CatalogItemData) => {
      if (!options?.onAccept || options.onAccept(data)) hideModal();
    };

    const onCancelCloseHandler = (data: CatalogItemData) => {
      if (!options?.onCancel || options.onCancel(data)) hideModal();
    };

    return (
      <CatalogConfigurationModal
        {...(options ?? {})}
        open={open}
        onExited={onExited}
        onAcceptClose={onAcceptCloseHandler}
        onCancelClose={onCancelCloseHandler}
      />
    );
  });

  return [showModal];
}
