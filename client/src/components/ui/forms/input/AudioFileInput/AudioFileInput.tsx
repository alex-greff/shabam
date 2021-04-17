import React, { VoidFunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./AudioFileInput.scss";
import classnames from "classnames";

import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import FileUploadButtonWrapper from "@/components/ui/buttons/FileUploadButtonWrapper/FileUploadButtonWrapper";
import UploadIcon from "@material-ui/icons/CloudUpload";

export interface Props extends BaseProps {
  onChange?: (audioFile: Blob | null) => unknown;
  accept?: string;
  disabled?: boolean;
}

const AudioFileInput: VoidFunctionComponent<Props> = (props) => {
  const { onChange, accept, disabled } = props;

  const [filename, setFilename] = useState<string | null>(null);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = e.target.files ? e.target.files[0] : null;

    if (audioFile) {
      setFilename(audioFile.name);
      if (onChange) onChange(audioFile);
    }
  };

  const hasFile = !!filename;

  return (
    <div
      className={classnames("AudioFileInput", props.className)}
      style={props.style}
      id={props.id}
    >
      <div className="AudioFileInput__display">
        <div className="AudioFileInput__title">Audio File</div>
        <div
          className={classnames("AudioFileInput__file-name", {
            "has-audio-file": hasFile,
          })}
        >
          {hasFile ? filename : "(None)"}
        </div>
      </div>

      <FileUploadButtonWrapper
        className="AudioFileInput__upload-button-wrapper"
        accept={accept}
        disabled={disabled}
        onChange={handleAudioFileChange}
        renderContent={({ disabled }) => {
          return (
            <IconButton
              className="AudioFileInput__upload-button"
              appearance="solid"
              mode="info"
              disabled={disabled}
              forceDiv
              renderIcon={() => <UploadIcon />}
            >
              Upload
            </IconButton>
          );
        }}
      />
    </div>
  );
};

AudioFileInput.defaultProps = {
  accept: "audio/*",
  disabled: false,
} as Partial<Props>;

export default AudioFileInput;
