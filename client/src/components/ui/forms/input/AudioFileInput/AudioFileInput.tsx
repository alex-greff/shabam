import React, { VoidFunctionComponent, useMemo } from "react";
import { BaseProps } from "@/types";
import "./AudioFileInput.scss";
import classnames from "classnames";
import { FieldError } from "react-hook-form";

import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import FileUploadButtonWrapper from "@/components/ui/buttons/FileUploadButtonWrapper/FileUploadButtonWrapper";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import ErrorMessageLabel from "@/components/ui/forms/labels/ErrorMessageLabel/ErrorMessageLabel";

export interface Props extends BaseProps {
  onChange?: (audioFile: File | null) => unknown;
  value?: File;
  error?: FieldError;

  accept?: string;
  disabled?: boolean;
}

const AudioFileInput: VoidFunctionComponent<Props> = (props) => {
  const { onChange, accept, disabled, value, error } = props;

  const filename = useMemo(() => {
    return value ? value.name : null;
  }, [value]);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = e.target.files ? e.target.files[0] : null;

    if (audioFile) {
      if (onChange) onChange(audioFile);
    }
  };

  const hasFile = !!filename;
  const hasError = !!error;

  return (
    <div
      className={classnames("AudioFileInput", props.className, {
        "has-error": hasError,
        disabled: disabled,
      })}
      style={props.style}
      id={props.id}
    >
      <div className="AudioFileInput__content">
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
              renderIcon={() => <MusicNoteIcon />}
              >
                Upload
              </IconButton>
            );
          }}
        />
      </div>

      <ErrorMessageLabel
        className="AudioFileInput__error-message"
        error={error}
      />
    </div>
  );
};

AudioFileInput.defaultProps = {
  accept: "audio/*",
  disabled: false,
} as Partial<Props>;

export default AudioFileInput;
