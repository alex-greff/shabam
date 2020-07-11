import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./FileUploadButtonWrapper.scss";
import classnames from "classnames";
import * as Utilities from "@/utilities";

interface RenderPropsData {
  disabled: boolean;
}

export interface Props
  extends React.InputHTMLAttributes<HTMLInputElement>,
    BaseProps {
  disabled?: boolean;
  renderContent: (data: RenderPropsData) => JSX.Element;
}

const FileUploadButton: FunctionComponent<Props> = (props) => {
  const {
    className,
    style,
    id,
    children,
    disabled,
    renderContent,
    ...rest
  } = props;

  const [genId] = useState(Utilities.generateId());

  return (
    <div
      className={classnames("FileUploadButtonWrapper", className, { disabled })}
      style={style}
      id={id}
    >
      <input
        {...rest}
        className="FileUploadButtonWrapper__file-input"
        type="file"
        id={genId}
      />

      <label
        className="FileUploadButtonWrapper__label-container"
        htmlFor={genId}
      >
        {renderContent({ disabled: disabled! })}
      </label>
    </div>
  );
};

FileUploadButton.defaultProps = {
  disabled: false,
} as Partial<Props>;

export default FileUploadButton;
