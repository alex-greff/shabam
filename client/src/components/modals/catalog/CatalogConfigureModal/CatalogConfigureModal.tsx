import React, { FunctionComponent, useState } from "react";
import "./CatalogConfigureModal.scss";
import classnames from "classnames";
import { CatalogArtist, CatalogItem } from "@/types/catalog";
import { useForm, Controller } from "react-hook-form";

import ConfirmationModal, {
  Props as ConfirmationModalProps,
} from "@/components/modals/ConfirmationModal/ConfirmationModal";
import FormInput from "@/components/ui/forms/input/FormInput/FormInput";
import ArtistInput from "@/components/ui/forms/input/ArtistInput/ArtistInput";
import AudioFileInput from "@/components/ui/forms/input/AudioFileInput/AudioFileInput";
import CoverArtFileInput from "@/components/ui/forms/input/CoverArtInput/CoverArtFileInput";

import AddCircleIcon from "@material-ui/icons/AddCircle";

export interface CatalogItemData extends CatalogItem {
  audioFile?: File;
  coverArtFile?: File;
}

export interface Props
  extends Omit<ConfirmationModalProps, "onAcceptClose" | "onCancelClose"> {
  initialData?: Partial<CatalogItemData>;
  onAcceptClose?: (data: CatalogItemData) => boolean | Promise<boolean>;
  onCancelClose?: () => boolean | Promise<boolean>;
  title?: string;
}

const INITIAL_DATA: CatalogItemData = {
  title: "",
  artists: [],
  audioFile: undefined,
  coverArtFile: undefined,
};

const CatalogConfigureModal: FunctionComponent<Props> = (props) => {
  const { initialData, onAcceptClose, onCancelClose, title, ...rest } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

    if (onAcceptClose) {
      const closed = await onAcceptClose(data);
      if (!closed) 
        setSubmitting(false);
    }
  });

  const onAcceptCloseHandler = () => {
    onSubmit();
  };

  const onCancelCloseHandler = () => {
    if (onCancelClose) onCancelClose();
  };

  // Validates that at least one primary artist exists
  const artistValidate = (artists: CatalogArtist[]) => {
    const primaries = artists.filter((artist) => artist.type === "primary");
    return primaries.length > 0 || "Primary artist needed";
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
            rules={{ validate: artistValidate }}
            render={({
              field: { onChange, onBlur, value, name },
              fieldState: { error },
            }) => {
              return (
                <ArtistInput
                  className="CatalogConfigureModal__artist-input"
                  layoutStyle="minimal"
                  renderTitle={() => "Artists"}
                  disabled={submitting}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                  error={error}
                />
              );
            }}
          />

          {/* Control audio file input */}
          <Controller
            name="audioFile"
            control={control}
            rules={{ required: "Audio file required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <AudioFileInput
                  className="CatalogConfigureModal__audio-file-input"
                  disabled={submitting}
                  onChange={(audioFile) => {
                    onChange(audioFile);
                  }}
                  value={value}
                  error={error}
                />
              );
            }}
          />
        </div>

        <div className="CatalogConfigureModal__cover-art-container">
          <Controller
            name="coverArtFile"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <CoverArtFileInput
                  className="CatalogConfigureModal__cover-art-file-input"
                  disabled={submitting}
                  onChange={(coverArtFile) => {
                    onChange(coverArtFile);
                  }}
                  value={value}
                  error={error}
                />
              );
            }}
          />
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
