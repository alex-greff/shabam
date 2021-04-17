import React, { FunctionComponent, useState } from "react";
import "./CatalogConfigureModal.scss";
import classnames from "classnames";
import { CatalogItem } from "@/types/catalog";
import {
  useForm,
  Controller,
} from "react-hook-form";

import ConfirmationModal, {
  Props as ConfirmationModalProps,
} from "@/components/modals/ConfirmationModal/ConfirmationModal";
import FormInput from "@/components/ui/forms/input/FormInput/FormInput";
import ArtistInput from "@/components/ui/forms/input/ArtistInput/ArtistInput";
import AudioFileInput from "@/components/ui/forms/input/AudioFileInput/AudioFileInput";

import AddCircleIcon from "@material-ui/icons/AddCircle";

export interface CatalogItemData extends CatalogItem {
  audioFile: Blob | null;
}

export interface Props
  extends Omit<ConfirmationModalProps, "onAcceptClose" | "onCancelClose"> {
  initialData?: Partial<CatalogItemData>;
  onAcceptClose?: (data: CatalogItemData) => unknown;
  onCancelClose?: () => unknown;
  title?: string;
}

const INITIAL_DATA: CatalogItemData = {
  title: "",
  artists: [],
  audioFile: null
};

const CatalogConfigureModal: FunctionComponent<Props> = (props) => {
  const { initialData, onAcceptClose, onCancelClose, title, ...rest } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors,
  } = useForm<CatalogItemData>({
    defaultValues: {
      ...INITIAL_DATA,
      ...initialData,
    },
  });

  const [submitting, setSubmitting] = useState(false);

  // This gets triggered by onAcceptCloseHandler
  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);

    console.log("Data", data); // TODO: remove

    // TODO: handle fingerprint gen and then submission

    // TODO: uncomment
    // if (onAcceptClose) onAcceptClose(data);
  });

  const onAcceptCloseHandler = () => {
    onSubmit();
  };

  const onCancelCloseHandler = () => {
    if (onCancelClose) onCancelClose();
  };

  return (
    <ConfirmationModal
      {...rest}
      className={classnames("CatalogConfigureModal", props.className)}
      style={props.style}
      id={props.id}
      onAcceptClose={onAcceptCloseHandler}
      onCancelClose={onCancelCloseHandler}
      disableAcceptButton={submitting}
      disableCancelButton={submitting}
    >
      <div className="CatalogConfigureModal__title">{title}</div>
      <form className="CatalogConfigureModal__form" onSubmit={onSubmit}>
        <div className="CatalogConfigureModal__main-container">
          <FormInput
            className="CatalogConfigureModal__title-input"
            {...register("title", { required: "Title is required" })}
            error={errors.title}
            type="text"
            name="title"
            layoutStyle="minimal"
            renderTitle={() => "Title"}
            disabled={submitting}
          />

          {/* Control the artists input */}
          <Controller
            name="artists"
            control={control}
            render={({ field: { onChange, onBlur } }) => {
              return (
                <ArtistInput
                  className="CatalogConfigureModal__artist-input"
                  layoutStyle="minimal"
                  renderTitle={() => "Artists"}
                  disabled={submitting}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              );
            }}
          />

          {/* Control audio file input */}
          {/* TODO: figure out how to add validation to ensure there is an audio file */}
          <Controller 
            name="audioFile"
            control={control}
            render={({ field: { onChange, onBlur } }) => {
              return (
                <AudioFileInput 
                  className="CatalogConfigureModal__audio-file-input"
                  onChange={(audioFile) => {
                    onChange(audioFile);
                  }}
                />
              );
            }}
          />
        </div>

        {/* TODO: complete the rest of the form */}

        <div className="CatalogConfigureModal__cover-art-container">
          TODO: Cover Art input
        </div>
      </form>
    </ConfirmationModal>
  );
};

CatalogConfigureModal.defaultProps = {
  acceptButtonText: "Configure",
  title: "Configure Catalog Item",
  maxWidth: "70rem",
  renderAcceptButtonIcon: () => <AddCircleIcon />,
} as Partial<Props>;

export default CatalogConfigureModal;
