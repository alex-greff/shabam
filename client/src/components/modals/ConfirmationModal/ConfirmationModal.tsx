import React, { FunctionComponent } from "react";
import "./ConfirmationModal.scss";
import classnames from "classnames";

import FooteredModal, {
  Props as FooteredModalProps,
} from "@/components/modals/FooteredModal/FooteredModal";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import { Mode as NormalButtonMode } from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props
  extends Omit<FooteredModalProps, "renderFooter" | "onRequestClose" | "disabled"> {
  acceptButtonText?: string;
  renderAcceptButtonIcon?: () => JSX.Element;
  disableAcceptButton?: boolean;
  onAcceptClose: () => unknown;
  acceptButtonMode?: NormalButtonMode;

  cancelButtonText?: string;
  renderCancelButtonIcon?: () => JSX.Element;
  disableCancelButton?: boolean;
  onCancelClose: () => unknown;
  cancelButtonMode?: NormalButtonMode;
}

const ConfirmationModal: FunctionComponent<Props> = (props) => {
  const {
    acceptButtonText,
    renderAcceptButtonIcon,
    disableAcceptButton,
    acceptButtonMode,
    onAcceptClose,
    cancelButtonText,
    renderCancelButtonIcon,
    disableCancelButton,
    cancelButtonMode,
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
          mode={acceptButtonMode}
        >
          {acceptButtonText}
        </IconButton>

        <IconButton
          className="ConfirmationModal__cancel-button"
          renderIcon={renderCancelButtonIcon}
          onClick={onCancelClose}
          disabled={disableCancelButton}
          appearance="solid"
          mode={cancelButtonMode}
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
      disabled={disableCancelButton}
    >
      {props.children}
    </FooteredModal>
  );
};

ConfirmationModal.defaultProps = {
  acceptButtonText: "Okay",
  disableAcceptButton: false,
  acceptButtonMode: "blue",
  cancelButtonText: "Cancel",
  disableCancelButton: false,
  cancelButtonMode: "grey"
} as Partial<Props>;

export default ConfirmationModal;
