import React, { VoidFunctionComponent } from "react";
import "./ArtistChip.scss";
import classnames from "classnames";
import { CatalogArtistType } from "@/types/catalog";

import Chip, { Props as ChipProps } from "@/components/ui/chips/Chip/Chip";

export interface Props extends ChipProps {
  name: string; 
  type: CatalogArtistType;
};

const generateDisplayText = (name: string, type: CatalogArtistType) => {
  if (type === "featured")
    return `ft. ${name}`;
  else if (type === "remix")
    return `${name} (remix)`;
  return name;
}

const ArtistChip: VoidFunctionComponent<Props> = (props) => {
  const { name, type, ...rest } = props;
  const displayText = generateDisplayText(name, type);

  return (
    <Chip 
      {...rest}
      className={classnames("ArtistChip", props.className)}
      style={props.style}
      id={props.id}
    >
      {displayText}
    </Chip>
  );
};

ArtistChip.defaultProps = {

} as Partial<Props>;

export default ArtistChip;