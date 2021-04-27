import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplayItem.scss";
import classnames from "classnames";
import { CatalogItemDisplayData } from "@/types/catalog";

export interface Props extends BaseProps {
  item: CatalogItemDisplayData;
};

const CatalogDisplayItem: FunctionComponent<Props> = (props) => {
  const { item } = props;
  const { title, artists, duration, plays, coverArtSrc } = item;

  return (
    <div 
      className={classnames("CatalogDisplayItem", props.className)}
      style={props.style}
      id={props.id}
    >
      {title}
    </div>
  );
};

CatalogDisplayItem.defaultProps = {

} as Partial<Props>;

export default CatalogDisplayItem;