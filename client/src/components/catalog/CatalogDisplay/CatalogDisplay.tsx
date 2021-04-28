import React, { useEffect, VoidFunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplay.scss";
import classnames from "classnames";
import withLoading, {
  Props as WithLoadingProps,
} from "@/components/hoc/withLoading";
import { CatalogItemDisplayData } from "@/types/catalog";

import CatalogDisplayItem from "@/components/catalog/CatalogDisplayItem/CatalogDisplayItem";
import PaginationControls from "@/components/ui/pagination/PaginationControls/PaginationControls";

export interface Props extends BaseProps, WithLoadingProps {
  tracks?: CatalogItemDisplayData[];
  loading?: boolean;
  totalTrackNum?: number;
  initialPage?: number;
  tracksPerPage?: number;
  configurable?: boolean;
  onPageChange?: (pageNum: number) => unknown;
  onEditClick?: (trackItem: CatalogItemDisplayData) => unknown;
  onRemoveClick?: (trackItem: CatalogItemDisplayData) => unknown;
}

const CatalogDisplay: VoidFunctionComponent<Props> = (props) => {
  const {
    tracks,
    loading,
    setIsLoading,
    totalTrackNum,
    initialPage,
    tracksPerPage,
    configurable,
    onPageChange,
    onEditClick,
    onRemoveClick,
  } = props;

  useEffect(() => {
    setIsLoading(loading!);
  }, [loading, setIsLoading]);

  const renderTracks = () => {
    return (
      <div className="CatalogDisplay__tracks">
        <div
          className={classnames("CatalogDisplay__tracks-header", {
            configurable,
          })}
        >
          <div className="CatalogDisplay__tracks-header-title">Title</div>
          <div className="CatalogDisplay__tracks-header-artists">Artists</div>
          <div className="CatalogDisplay__tracks-header-duration">Duration</div>
          <div className="CatalogDisplay__tracks-header-searches">Searches</div>
        </div>
        <div className="CatalogDisplay__tracks-list">
          {tracks!.map((track, idx) => {
            return (
              <CatalogDisplayItem
                key={idx}
                className="CatalogDisplay__track"
                item={track}
                configurable={configurable}
                onEditClick={() => {
                  if (onEditClick) onEditClick(track);
                }}
                onRemoveClick={() => {
                  if (onRemoveClick) onRemoveClick(track);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderNoTracksFound = () => {
    return <div className="CatalogDisplay__empty-text">No tracks found.</div>;
  };

  return (
    <div
      className={classnames("CatalogDisplay", props.className)}
      style={props.style}
      id={props.id}
    >
      {tracks!.length > 0 ? renderTracks() : renderNoTracksFound()}

      <PaginationControls
        className="CatalogDisplay__pagination-controls"
        initPage={initialPage}
        numPages={Math.ceil(totalTrackNum! / tracksPerPage!)}
        onPageChange={onPageChange}
      />
    </div>
  );
};

CatalogDisplay.defaultProps = {
  loading: false,
  tracks: [],
  totalTrackNum: 0,
  initialPage: 0,
  tracksPerPage: 10,
  configurable: false,
} as Partial<Props>;

export default withLoading(CatalogDisplay);
