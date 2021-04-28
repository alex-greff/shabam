import React, { FunctionComponent, useMemo, useState } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplayItem.scss";
import classnames from "classnames";
import { CatalogItemDisplayData } from "@/types/catalog";
import * as Utilities from "@/utilities";
import { CSSTransition } from "react-transition-group";
import useOutsideClick from "@/hooks/useOutsideClick";

import CoverArtImage from "@/components/catalog/CoverArtImage/CoverArtImage";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";

export interface Props extends BaseProps {
  item: CatalogItemDisplayData;
  configurable?: boolean;
  onEditClick?: () => unknown;
  onRemoveClick?: () => unknown;
}

const CatalogDisplayItem: FunctionComponent<Props> = (props) => {
  const { item, configurable, onEditClick, onRemoveClick } = props;
  const { title, artists, duration, plays, coverArtSrc } = item;

  const [configOpen, setConfigOpen] = useState(false);

  const configRootRef = useOutsideClick<HTMLDivElement>(() => {
    // Close the config dropdown if the click was outside the element
    if (configOpen)
      setConfigOpen(false);
  }, [configOpen]);

  const artistDisplay = useMemo(() => Utilities.formatArtists(artists), [
    artists,
  ]);
  const durationDisplay = useMemo(() => Utilities.formatDuration(duration), [
    duration,
  ]);
  const searchesDisplay = useMemo(() => Utilities.formatPlays(plays), [plays]);

  const toggleConfig = () => setConfigOpen(!configOpen);

  return (
    <div
      className={classnames("CatalogDisplayItem", props.className, {
        configurable,
      })}
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
      {configurable && (
        <div className="CatalogDisplayItem__config" ref={configRootRef} >
          <IconButton
            className="CatalogDisplayItem__config-button"
            renderIcon={() => <MoreHorizIcon />}
            onClick={toggleConfig}
          />

          <CSSTransition
            in={configOpen}
            timeout={200}
            classNames={"CatalogDisplayItem-anim"}
            unmountOnExit={true}
          >
            <div className="CatalogDisplayItem__config-dropdown">
              <IconButton
                className="CatalogDisplayItem__config-edit-button"
                renderIcon={() => <CreateIcon />}
                onClick={() => {
                  if (onEditClick)
                    onEditClick();
                }}
              >
                Edit
              </IconButton>

              <IconButton
                className="CatalogDisplayItem__config-delete-button"
                renderIcon={() => <DeleteIcon />}
                onClick={() => {
                  if (onRemoveClick)
                  onRemoveClick();
                }}
              >
                Delete
              </IconButton>
            </div>
          </CSSTransition>
        </div>
      )}
    </div>
  );
};

CatalogDisplayItem.defaultProps = {
  configurable: false,
} as Partial<Props>;

export default CatalogDisplayItem;
