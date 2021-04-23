import React, { useMemo, useRef, useState, FunctionComponent } from "react";
import "./ArtistInput.scss";
import classnames from "classnames";
import { CatalogArtist, CatalogCollaborationType } from "@/types/catalog";
import * as Utilities from "@/utilities";

import FormInput, {
  Props as FormInputProps,
} from "@/components/ui/forms/input/FormInput/FormInput";
import SelectDropdown from "@/components/ui/forms/dropdown/SelectDropdown/SelectDropdown";
import ArtistChip from "@/components/ui/chips/ArtistChip/ArtistChip";

import AddIcon from "@material-ui/icons/Add";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import { FieldError } from "react-hook-form";

interface OptionType {
  value: CatalogCollaborationType;
  label: string;
}

const OPTIONS: OptionType[] = [
  { value: "primary", label: "Primary" },
  { value: "featured", label: "Featured" },
  { value: "remix", label: "Remix" },
];

const DEFAULT_OPTION: OptionType = {
  value: "primary",
  label: "Primary",
};

type ReactSelectData = {
  label: string;
  value: string;
} | null;

export interface Props
  extends Omit<
    FormInputProps,
    "type" | "error" | "ref" | "onChange" | "onBlur" | "value"
  > {
  initialData?: CatalogArtist[];

  onChange?: (data: CatalogArtist[]) => unknown;
  onBlur?: () => unknown;
  value?: CatalogArtist[];
  error?: FieldError;
}

const ArtistInput: FunctionComponent<Props> = (props) => {
  const { initialData, onChange, onBlur, value, error, ...rest } = props;
  const { disabled } = rest;

  const inputRef = useRef<HTMLInputElement>(null);

  const [currType, setCurrType] = useState<CatalogCollaborationType>("primary");
  const [currInput, setCurrInput] = useState<string>("");

  const addableInput = !!currInput;

  const sortedValue = useMemo(() => {
    return Utilities.sortArtistsByType(value!).reverse();
  }, [value]);

  const handleArtistAdd = () => {
    const artist = inputRef.current?.value!;

    if (!artist) {
      return;
    }

    const newValue = [...value!];
    newValue.push({ name: artist, type: currType });

    // Trigger change
    if (onChange) onChange(newValue);

    inputRef.current!.value = "";
    setCurrInput("");
  };

  const handleArtistRemove = (item: CatalogArtist) => {
    const newValue = value!.filter(
      (currValue) => currValue.name !== item.name
    );

    if (onChange) onChange(newValue);
  };

  const handleDropdownChange = (e: ReactSelectData) => {
    setCurrType(e!.value as CatalogCollaborationType);
  };

  const renderCustom = () => {
    return (
      <div className="ArtistInput__custom-container">
        <SelectDropdown
          className="ArtistInput__dropdown"
          options={OPTIONS}
          defaultValue={DEFAULT_OPTION}
          isDisabled={disabled}
          onChange={handleDropdownChange}
        />
        <IconButton
          className="ArtistInput__add-artist"
          renderIcon={() => <AddIcon />}
          disabled={disabled || !addableInput}
          onClick={(e) => {
            e.preventDefault();
            handleArtistAdd();
          }}
        />
      </div>
    );
  };

  return (
    <div className="ArtistInput">
      <FormInput
        {...rest}
        ref={inputRef}
        className={classnames("ArtistInput__input", props.className)}
        disabled={disabled}
        renderCustom={renderCustom}
        onChange={(e) => {
          setCurrInput(e.target.value);
        }}
        onBlur={() => {
          if (onBlur) onBlur();
        }}
        error={error}
      />
      {/* Display artist chips */}
      <div className="ArtistInput__chips-list">
        {sortedValue.map((item, idx) => (
          <ArtistChip
            key={idx}
            removable
            className="ArtistInput__chip"
            name={item.name}
            type={item.type}
            disabled={disabled}
            onRemove={() => handleArtistRemove(item)}
          />
        ))}
      </div>
    </div>
  );
};

ArtistInput.defaultProps = {
  initialData: [],
  value: [],
} as Partial<Props>;

export default ArtistInput;
