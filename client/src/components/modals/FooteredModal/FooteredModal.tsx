import React, { FunctionComponent } from "react";
import "./FooteredModal.scss";
import classnames from "classnames";

import BaseModal, { Props as BaseModalProps } from "@/components/modals/BaseModal/BaseModal";

export interface Props extends BaseModalProps {
  renderFooter?: () => JSX.Element;
};

const FooteredModal: FunctionComponent<Props> = (props) => {
  const { className, renderFooter, ...rest } = props;
  return (
    <BaseModal 
      {...rest}
      className={classnames("FooteredModal", className)}
    >
      <div className="FooteredModal__container">
        <div className="FooteredModal__content">
          {props.children}
        </div>
        <div className="FooteredModal__footer">
          {(renderFooter ? renderFooter() : null)}
        </div>
      </div>
    </BaseModal>
  );
};

FooteredModal.defaultProps = {

} as Partial<Props>;

export default FooteredModal;