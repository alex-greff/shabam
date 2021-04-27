import React, { FunctionComponent, useMemo } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplayItem.scss";
import classnames from "classnames";
import { CatalogItemDisplayData } from "@/types/catalog";
import * as Utilities from "@/utilities";

import CoverArtImage from "@/components/catalog/CoverArtImage/CoverArtImage";

import PlayArrowIcon from "@material-ui/icons/PlayArrow"

export interface Props extends BaseProps {
  item: CatalogItemDisplayData;
}

const CatalogDisplayItem: FunctionComponent<Props> = (props) => {
  const { item } = props;
  const { title, artists, duration, plays, coverArtSrc } = item;

  const artistDisplay = useMemo(() => Utilities.formatArtists(artists), [
    artists,
  ]);

  const durationDisplay = useMemo(() => Utilities.formatDuration(duration), [
    duration,
  ]);

  const searchesDisplay = useMemo(() => Utilities.formatPlays(plays), [plays]);

  return (
    <div
      className={classnames("CatalogDisplayItem", props.className)}
      style={props.style}
      id={props.id}
    >
      <CoverArtImage
        className="CatalogDisplayItem__cover-art"
        src={coverArtSrc}
      />
      <div className="CatalogDisplayItem__title">{title}</div>
      <div className="CatalogDisplayItem__artists">{artistDisplay}</div>
      <div className="CatalogDisplayItem__duration">{durationDisplay}</div>
      <div className="CatalogDisplayItem__searches">
        <PlayArrowIcon className="CatalogDisplayItem__searches-icon" /> 
        {searchesDisplay}
      </div>
    </div>
  );
};

CatalogDisplayItem.defaultProps = {} as Partial<Props>;

export default CatalogDisplayItem;
