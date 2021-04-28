import React, { useEffect, useState, VoidFunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplay.scss";
import classnames from "classnames";
import { TracksFilterInput, useGetTracksQuery } from "@/graphql-apollo.g.d";
import withLoading, {
  Props as WithLoadingProps,
} from "@/components/hoc/withLoading";
import * as GraphqlTransformers from "@/utilities/graphqlTransformers";
import { CatalogItemDisplayData } from "@/types/catalog";

import CatalogDisplayItem from "@/components/catalog/CatalogDisplayItem/CatalogDisplayItem";
import PaginationControls from "@/components/ui/pagination/PaginationControls/PaginationControls";

export interface Props extends BaseProps, WithLoadingProps {
  filter?: TracksFilterInput;
  initialPage?: number;
  tracksPerPage?: number;
  configurable?: boolean;
  onEditClick?: (trackItem: CatalogItemDisplayData) => unknown;
  onRemoveClick?: (trackItem: CatalogItemDisplayData) => unknown;
}

const CatalogDisplay: VoidFunctionComponent<Props> = (props) => {
  const {
    setIsLoading,
    filter,
    initialPage,
    tracksPerPage,
    configurable,
    onEditClick,
    onRemoveClick,
  } = props;

  const [currPage, setCurrPage] = useState(initialPage!);

  const { data, loading, error, fetchMore } = useGetTracksQuery({
    variables: {
      limit: tracksPerPage!,
      offset: currPage * tracksPerPage!,
      filter: {
        // TODO: set this up properly
      },
    },
  });

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  if (!data) return null;

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
          {data.getTracks.map((track) => {
            const trackItem = GraphqlTransformers.trackToCatalogItemDisplayData(
              track
            );

            return (
              <CatalogDisplayItem
                className="CatalogDisplay__track"
                item={trackItem}
                configurable={configurable}
                onEditClick={() => {
                  if (onEditClick) onEditClick(trackItem);
                }}
                onRemoveClick={() => {
                  if (onRemoveClick) onRemoveClick(trackItem);
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

  const handlePageChange = (page: number) => {
    fetchMore({
      variables: {
        limit: tracksPerPage!,
        offset: page * tracksPerPage!,
        filter: {
          // TODO: set this up properly
        },
      },
    });
    setCurrPage(page);
  };

  return (
    <div
      className={classnames("CatalogDisplay", props.className)}
      style={props.style}
      id={props.id}
    >
      {data.getTracks.length > 0 ? renderTracks() : renderNoTracksFound()}

      <PaginationControls
        className="CatalogDisplay__pagination-controls"
        numPages={Math.ceil(data.getTracksNum / tracksPerPage!)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

CatalogDisplay.defaultProps = {
  initialPage: 0,
  tracksPerPage: 10,
  configurable: false,
} as Partial<Props>;

export default withLoading(CatalogDisplay);
