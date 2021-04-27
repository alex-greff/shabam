import React, { useEffect, useState, VoidFunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplay.scss";
import classnames from "classnames";
import { TracksFilterInput, useGetTracksQuery } from "@/graphql-apollo.g.d";
import withLoading, {
  Props as WithLoadingProps,
} from "@/components/hoc/withLoading";
import * as GraphqlTransformers from "@/utilities/graphqlTransformers";

import CatalogDisplayItem from "@/components/catalog/CatalogDisplayItem/CatalogDisplayItem";
import PaginationControls from "@/components/ui/pagination/PaginationControls/PaginationControls";

export interface Props extends BaseProps, WithLoadingProps {
  filter?: TracksFilterInput;
  initialPage?: number;
  tracksPerPage?: number;
}

const CatalogDisplay: VoidFunctionComponent<Props> = (props) => {
  const { setIsLoading, filter, initialPage, tracksPerPage } = props;

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
        <div className="CatalogDisplay__tracks-header">
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
              />
            );
          })}
        </div>
      </div>
    );
  };

  // console.log("DATA", data); // TODO: remove

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
      {/* TODO: render pagination controls */}

      <PaginationControls
        className="CatalogDisplay__pagination-controls"
        numPages={data.getTracksNum}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

CatalogDisplay.defaultProps = {
  initialPage: 0,
  // tracksPerPage: 10, // TODO: set back
  tracksPerPage: 1,
} as Partial<Props>;

export default withLoading(CatalogDisplay);
