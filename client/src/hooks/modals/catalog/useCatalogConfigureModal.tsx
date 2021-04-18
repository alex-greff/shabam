import React from "react";
import { useModal } from "react-modal-hook";
import { ShowModal } from "@/hooks/modals/types";

import CatalogConfigurationModal, {
  Props as CatalogConfigurationModalProps,
  CatalogItemData,
} from "@/components/modals/catalog/CatalogConfigureModal/CatalogConfigureModal";

export interface Options
  extends Omit<
    CatalogConfigurationModalProps,
    "onAcceptClose" | "onCancelClose"
  > {
  onAccept?: (data: CatalogItemData) => boolean | Promise<boolean>;
  onCancel?: () => boolean | Promise<boolean>;
}

export function useCatalogConfigureModal(
  options?: Partial<Options>
): [ShowModal] {
  const [showModal, hideModal] = useModal(({ in: open, onExited }) => {
    const onAcceptCloseHandler = async (data: CatalogItemData) => {
      if (!options?.onAccept || await options.onAccept(data)) {
        hideModal();
        return true;
      }
      return false;
    };

    const onCancelCloseHandler = async () => {
      if (!options?.onCancel || await options.onCancel()) {
        hideModal();
        return true;
      }
      return false;
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
