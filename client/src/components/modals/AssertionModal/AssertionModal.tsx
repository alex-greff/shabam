import React, { FunctionComponent } from "react";
import "./AssertionModal.scss";
import classnames from "classnames";

import FooteredModal, {
  Props as FooteredModalProps,
} from "@/components/modals/FooteredModal/FooteredModal";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import { Mode as NormalButtonMode } from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props extends Omit<FooteredModalProps, "renderFooter" | "onRequestClose"> {
  assertionButtonText?: string;
  renderAssertionButtonIcon?: () => JSX.Element;
  disableAssertionButton?: boolean;
  onAssertionClose: () => unknown;
  assertionButtonMode?: NormalButtonMode;
}

const AssertionModal: FunctionComponent<Props> = (props) => {
  const {
    className,
    assertionButtonText,
    disableAssertionButton,
    assertionButtonMode,
    renderAssertionButtonIcon,
    onAssertionClose,
    ...rest
  } = props;

  const renderFooter = () => {
    return (
      <IconButton
        className="AssertionModal__assertion-button"
        renderIcon={renderAssertionButtonIcon}
        onClick={onAssertionClose}
        disabled={disableAssertionButton}
        appearance="solid"
        mode={assertionButtonMode}
      >
        {assertionButtonText}
      </IconButton>
    );
  };

  return (
    <FooteredModal
      {...rest}
      className={classnames("AssertionModal", props.className)}
      renderFooter={renderFooter}
      onRequestClose={onAssertionClose}
    >
      {props.children}
    </FooteredModal>
  );
};

AssertionModal.defaultProps = {
  assertionButtonText: "Okay",
  assertionButtonMode: "blue",
  disableAssertionButton: false,
} as Partial<Props>;

export default AssertionModal;
