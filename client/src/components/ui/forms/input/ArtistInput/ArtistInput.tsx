import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./ArtistInput.scss";
import classnames from "classnames";
import { CatalogArtist, CatalogArtistType } from "@/types/catalog";
// import Select from "react-select";

import FormInput, { Props as FormInputProps } from "@/components/ui/forms/input/FormInput/FormInput";
import SelectDropdown from "@/components/ui/forms/dropdown/SelectDropdown/SelectDropdown";

interface OptionType {
  value: CatalogArtistType;
  label: string;
}

const OPTIONS: OptionType[] = [
  { value: "primary", label: "Primary" },
  { value: "featured", label: "Featured" },
  { value: "remix", label: "Remix" },
];

export interface Props extends Omit<FormInputProps, "type"> {
  initialData?: CatalogArtist[];
};

const ArtistInput: FunctionComponent<Props> = (props) => {
  const { initialData, ...rest } = props;
  const { disabled } = rest;

  // TODO: hook up to form properly

  const renderCustom = () => {
    return (
      <SelectDropdown
        className="ArtistInput__dropdown"
        options={OPTIONS}
      />
      // TODO: add + button
    );
  }

  return (
    <FormInput 
      {...rest}
      className={classnames("ArtistInput", props.className)}
      renderCustom={renderCustom}
      renderIcon={() => "X"}
    />
    // TODO: display selected artists 
  );
};

ArtistInput.defaultProps = {
  initialData: []
} as Partial<Props>;

export default ArtistInput;