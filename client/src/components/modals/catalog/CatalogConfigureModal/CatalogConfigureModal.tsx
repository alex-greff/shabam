import React, { FunctionComponent, useState } from "react";
import "./CatalogConfigureModal.scss";
import classnames from "classnames";

import ConfirmationModal, {
  Props as ConfirmationModalProps,
} from "@/components/modals/ConfirmationModal/ConfirmationModal";
import { CatalogItem } from "@/types/catalog";

export interface CatalogItemData extends CatalogItem {}

export interface Props
  extends Omit<ConfirmationModalProps, "onAcceptClose" | "onCancelClose"> {
  initialData?: Partial<CatalogItemData>;
  onAcceptClose?: (data: CatalogItemData) => unknown;
  onCancelClose?: (data: CatalogItemData) => unknown;
}

const INITIAL_DATA: CatalogItemData = {
  title: "",
  artists: [],
};

const CatalogConfigureModal: FunctionComponent<Props> = (props) => {
  const { initialData, onAcceptClose, onCancelClose, ...rest } = props;

  const [data, setData] = useState<CatalogItemData>({
    ...INITIAL_DATA,
    ...initialData,
  });

  const onAcceptCloseHandler = () => {
    if (onAcceptClose) onAcceptClose(data);
  };

  const onCancelCloseHandler = () => {
    if (onCancelClose) onCancelClose(data);
  };

  return (
    <ConfirmationModal
      {...rest}
      className={classnames("CatalogConfigureModal", props.className)}
      style={props.style}
      id={props.id}
      onAcceptClose={onAcceptCloseHandler}
      onCancelClose={onCancelCloseHandler}
    >
      Stuff
    </ConfirmationModal>
  );
};

CatalogConfigureModal.defaultProps = {} as Partial<Props>;

export default CatalogConfigureModal;
