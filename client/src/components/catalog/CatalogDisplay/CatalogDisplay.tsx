import React, { useEffect, useState, VoidFunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./CatalogDisplay.scss";
import classnames from "classnames";
import { Track, TracksFilterInput, useGetTracksQuery } from "@/graphql-apollo.g.d";
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
}

const CatalogDisplay: VoidFunctionComponent<Props> = (props) => {
  const { setIsLoading, filter, initialPage, tracksPerPage } = props;

  const [currPage, setCurrPage] = useState(initialPage!);

  const { data, loading, error } = useGetTracksQuery({
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
    return data.getTracks.map((track) => {
      const trackItem = GraphqlTransformers.trackToCatalogItemDisplayData(
        track
      );

      return <CatalogDisplayItem item={trackItem} />;
    });
  }

  console.log("DATA", data); // TODO: remove

  const renderNoTracksFound = () => {
    return (
      <div className="CatalogDisplay__empty-text">No tracks found.</div>
    )
  }

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
        numPages={5}
      />
    </div>
  );
};

CatalogDisplay.defaultProps = {
  initialPage: 0,
  // tracksPerPage: 10, // TODO: set back
  tracksPerPage: 2,
} as Partial<Props>;

export default withLoading(CatalogDisplay);
