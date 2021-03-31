import React, { FunctionComponent } from "react";
import "./ConfirmationModal.scss";
import classnames from "classnames";

import FooteredModal, {
  Props as FooteredModalProps,
} from "@/components/modals/FooteredModal/FooteredModal";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";

export interface Props
  extends Omit<FooteredModalProps, "renderFooter" | "onRequestClose"> {
  acceptButtonText?: string;
  renderAcceptButtonIcon?: () => JSX.Element;
  disableAcceptButton?: boolean;
  onAcceptClose: () => unknown;

  cancelButtonText?: string;
  renderCancelButtonIcon?: () => JSX.Element;
  disableCancelButton?: boolean;
  onCancelClose: () => unknown;
}

const ConfirmationModal: FunctionComponent<Props> = (props) => {
  const {
    acceptButtonText,
    renderAcceptButtonIcon,
    disableAcceptButton,
    onAcceptClose,
    cancelButtonText,
    renderCancelButtonIcon,
    disableCancelButton,
    onCancelClose,
    ...rest
  } = props;

  const renderFooter = () => {
    return (
      <>
        <IconButton
          className="ConfirmationModal__confirm-button"
          renderIcon={renderAcceptButtonIcon}
          onClick={onAcceptClose}
          disabled={disableAcceptButton}
          appearance="solid"
          mode="blue"
        >
          {acceptButtonText}
        </IconButton>

        <IconButton
          className="ConfirmationModal__cancel-button"
          renderIcon={renderCancelButtonIcon}
          onClick={onCancelClose}
          disabled={disableCancelButton}
          appearance="solid"
          mode="grey"
        >
          {cancelButtonText}
        </IconButton>
      </>
    );
  };

  return (
    <FooteredModal
      {...rest}
      className={classnames("ConfirmationModal", props.className)}
      renderFooter={renderFooter}
      onRequestClose={onCancelClose}
    >
      {props.children}
    </FooteredModal>
  );
};

ConfirmationModal.defaultProps = {
  acceptButtonText: "Okay",
  disableAcceptButton: false,
  cancelButtonText: "Cancel",
  disableCancelButton: false,
} as Partial<Props>;

export default ConfirmationModal;
