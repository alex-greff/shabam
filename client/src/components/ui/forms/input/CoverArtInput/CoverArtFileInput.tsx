import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./CoverArtFileInput.scss";
import classnames from "classnames";

import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import FileUploadButtonWrapper from "@/components/ui/buttons/FileUploadButtonWrapper/FileUploadButtonWrapper";
import CoverArtImage from "@/components/catalog/CoverArtImage/CoverArtImage";
import ImageIcon from "@material-ui/icons/Image";

export interface Props extends BaseProps {
  onChange?: (audioFile: Blob | null) => unknown;
  accept?: string;
  disabled?: boolean;
};

const CoverArtFileInput: FunctionComponent<Props> = (props) => {
  const { onChange, accept, disabled } = props;

  const [coverArtFile, setCoverArtFile] = useState<Blob | null>(null);

  const handleCoverArtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coverArtFile = e.target.files ? e.target.files[0] : null;

    if (coverArtFile) {
      setCoverArtFile(coverArtFile);
      if (onChange) onChange(coverArtFile);
    }
  };

  return (
    <div 
      className={classnames("CoverArtFileInput", props.className)}
      style={props.style}
      id={props.id}
    >
      <div className="CoverArtFileInput__title">
        Cover Art
      </div>

      <div className="CoverArtFileInput__preview">
        <CoverArtImage 
          src={coverArtFile ? coverArtFile : undefined}
        />
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
  );
};

CoverArtFileInput.defaultProps = {
  accept: "image/*"
} as Partial<Props>;

export default CoverArtFileInput;