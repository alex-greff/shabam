import React, { useMemo, useRef, useState, FunctionComponent } from "react";
import "./ArtistInput.scss";
import classnames from "classnames";
import { CatalogArtist, CatalogArtistType } from "@/types/catalog";
import * as Utilities from "@/utilities";

import FormInput, {
  Props as FormInputProps,
} from "@/components/ui/forms/input/FormInput/FormInput";
import SelectDropdown from "@/components/ui/forms/dropdown/SelectDropdown/SelectDropdown";
import ArtistChip from "@/components/ui/chips/ArtistChip/ArtistChip";

import AddIcon from "@material-ui/icons/Add";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";

interface OptionType {
  value: CatalogArtistType;
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
    "type" | "error" | "name" | "ref" | "onChange" | "onBlur"
  > {
  initialData?: CatalogArtist[];
  onChange?: (data: CatalogArtist[]) => unknown;
  onBlur?: (data: CatalogArtist[]) => unknown;
}

const ArtistInput: FunctionComponent<Props> = (props) => {
  const { initialData, onChange, onBlur, ...rest } = props;
  const { disabled } = rest;

  const inputRef = useRef<HTMLInputElement>(null);

  const [currType, setCurrType] = useState<CatalogArtistType>("primary");
  const [data, setData] = useState<CatalogArtist[]>(initialData ?? []);
  const [currInput, setCurrInput] = useState<string>("");

  const addableInput = !!currInput;

  const sortedData = useMemo(() => {
    return Utilities.sortArtistsByType(data).reverse();
  }, [data]);

  const handleArtistAdd = () => {
    const artist = inputRef.current?.value!;

    if (!artist) {
      return;
    }

    const newData = [...data];
    newData.push({ artist: artist, type: currType });
    setData(newData);

    // Trigger change
    if (onChange) onChange(newData);

    inputRef.current!.value = "";
    setCurrInput("");
  };

  const handleArtistRemove = (item: CatalogArtist) => {
    const newData = data.filter((currData) => currData.artist !== item.artist);
    setData(newData);

    if (onChange) onChange(newData);
  };

  const handleDropdownChange = (e: ReactSelectData) => {
    setCurrType(e!.value as CatalogArtistType);
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
          if (onBlur) onBlur(data);
        }}
      />
      {/* Display artist chips */}
      <div className="ArtistInput__chips-list">
        {sortedData.map((item) => (
          <ArtistChip
            removable
            className="ArtistInput__chip"
            name={item.artist}
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
} as Partial<Props>;

export default ArtistInput;
