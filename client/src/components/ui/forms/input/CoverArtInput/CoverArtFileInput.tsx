import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CoverArtFileInput.scss";
import classnames from "classnames";
import { FieldError } from "react-hook-form";

import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import FileUploadButtonWrapper from "@/components/ui/buttons/FileUploadButtonWrapper/FileUploadButtonWrapper";
import CoverArtImage from "@/components/catalog/CoverArtImage/CoverArtImage";
import ImageIcon from "@material-ui/icons/Image";
import ErrorMessageLabel from "@/components/ui/forms/labels/ErrorMessageLabel/ErrorMessageLabel";

export interface Props extends BaseProps {
  onChange?: (audioFile: File | null) => unknown;
  value?: File;
  error?: FieldError;

  accept?: string;
  disabled?: boolean;
  placeholderError?: boolean;
}

const CoverArtFileInput: FunctionComponent<Props> = (props) => {
  const { onChange, accept, disabled, value, error, placeholderError } = props;

  const handleCoverArtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coverArtFile = e.target.files ? e.target.files[0] : null;

    if (coverArtFile) {
      if (onChange) onChange(coverArtFile);
    }
  };

  const hasError = !!error;

  return (
    <div
      className={classnames("CoverArtFileInput", props.className, {
        "has-error": hasError,
        disabled: disabled,
      })}
      style={props.style}
      id={props.id}
    >
      <div className="CoverArtFileInput__content">
        <div className="CoverArtFileInput__title">Cover Art</div>

        <div className="CoverArtFileInput__preview">
          <CoverArtImage src={value ? value : undefined} disabled={disabled} />
        </div>

        <FileUploadButtonWrapper
          className="CoverArtFileInput__upload-button-wrapper"
          accept={accept}
          disabled={disabled}
          onChange={handleCoverArtFileChange}
          renderContent={({ disabled }) => {
            return (
              <IconButton
                className="CoverArtFileInput__upload-button"
                appearance="solid"
                mode="info"
                disabled={disabled}
                forceDiv
                renderIcon={() => <ImageIcon />}
              >
                Upload
              </IconButton>
            );
          }}
        />
      </div>

      {(!hasError && !placeholderError) ? null : (
        <ErrorMessageLabel
        className="CoverArtFileInput__error-message"
          error={error}
        />
      )}
    </div>
  );
};

CoverArtFileInput.defaultProps = {
  accept: "image/*",
  placeholderError: true
} as Partial<Props>;

export default CoverArtFileInput;
