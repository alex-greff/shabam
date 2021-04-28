import React, { FunctionComponent, useMemo, useState } from "react";
import { BaseProps } from "@/types";
import "./AccountCatalog.scss";
import classnames from "classnames";
import { useAccountLocation } from "@/hooks/useAccountLocation";
import * as Utilities from "@/utilities";
import { WasmFingerprintGenerator } from "@/fingerprint/WasmFingerprintGenerator";
import * as AudioUtilities from "@/audio/utilities";
import * as NotificationManager from "@/managers/NotificationManager";
import * as GraphqlTransformers from "@/utilities/graphqlTransformers";
import { useCatalogConfigureModal } from "@/hooks/modals/catalog/useCatalogConfigureModal";
import { CatalogItemData } from "@/components/modals/catalog/CatalogConfigureModal/CatalogConfigureModal";
import {
  useAddTrackMutation,
  useRemoveTrackMutation,
  useGetTracksQuery,
} from "@/graphql-apollo.g.d";
import { CatalogItemDisplayData } from "@/types/catalog";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import BreadcrumbTrail, {
  BreadcrumbTrailItem,
} from "@/components/nav/BreadcrumbTrail/BreadcrumbTrail";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import AddIcon from "@material-ui/icons/Add";
import CatalogDisplay from "@/components/catalog/CatalogDisplay/CatalogDisplay";

export interface Props extends Omit<BaseProps, "id"> {}

const TRACKS_PER_PAGE = 10;
const DEFAULT_INITIAL_PAGE = 0;

const wasmFpGenerator = new WasmFingerprintGenerator();

const AccountCatalog: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();

  const initPage = DEFAULT_INITIAL_PAGE;

  // TODO: grab the initial page from a query param
  const [currPage, setCurrPage] = useState(initPage);

  const [addTrack] = useAddTrackMutation();
  const [runRemoveTrack] = useRemoveTrackMutation();

  const {
    data: tracksData,
    loading: tracksLoading,
    refetch: refetchTracks,
  } = useGetTracksQuery({
    variables: {
      limit: TRACKS_PER_PAGE,
      offset: currPage * TRACKS_PER_PAGE,
      filter: {
        // TODO: set this up
      },
    },
  });

  const tracks = useMemo(() => {
    if (!tracksData) return undefined;
    return tracksData.getTracks.map((trackData) =>
      GraphqlTransformers.trackToCatalogItemDisplayData(trackData)
    );
  }, [tracksData]);

  const totalTracksNum = useMemo(() => tracksData?.getTracksNum, [tracksData]);

  const handleTrackPageChange = (newPage: number) => {
    // Note: this will trigger the query to rerun
    setCurrPage(newPage);
  };

  const onCreateCatalogItem = async (data: CatalogItemData) => {
    console.log("Catalog Data", data); // TODO: remove

    if (!data.audioFile) {
      NotificationManager.showErrorNotification("No audio file given.");
      return false;
    }

    try {
      // Create the spectrogram data
      const audioBuffer = await AudioUtilities.convertBlobToAudioBuffer(
        data.audioFile
      );
      const downsampledAudioBuffer = await AudioUtilities.downsample(
        audioBuffer
      );
      const spectrogramData = await AudioUtilities.computeSpectrogramData(
        downsampledAudioBuffer
      );

      console.log("Computing fingerprint..."); // TODO: remove

      // Compute the fingerprint
      const fingerprint = await wasmFpGenerator.generateFingerprint(
        spectrogramData
      );

      if (!fingerprint) {
        NotificationManager.showErrorNotification(
          "Unable to generate fingerprint."
        );
        return false;
      }

      console.log("Finished computing fingerprint!"); // TODO: remove
      console.log(fingerprint); // TODO: remove
      console.log("Creating track..."); // TODO: remove

      const audioDuration = await AudioUtilities.getAudioDuration(
        data.audioFile
      );

      // Attempt to create the track
      const result = await addTrack({
        variables: {
          trackData: {
            title: data.title,
            artists: data.artists.map((artist) =>
              GraphqlTransformers.toArtistInput(artist)
            ),
            fingerprint: GraphqlTransformers.toFingerprintInput(fingerprint),
            coverArt: data.coverArtFile,
            duration: audioDuration,
          },
        },
      });

      console.log("Track created!"); // TODO: remove

      if (result.errors) {
        NotificationManager.showErrorNotification("Error creating track.");
        return false;
      }
    } catch (err) {
      console.error(err);
      NotificationManager.showErrorNotification("An unexpected error ocurred.");
      return false;
    }
    
    // Update the track list
    refetchTracks();

    return true;
  };

  const [showCreateModal] = useCatalogConfigureModal({
    title: "Create Catalog Item",
    onAccept: onCreateCatalogItem,
    requestCloseOnOuterClick: false,
  });

  const breadcrumbItems: BreadcrumbTrailItem[] = [
    {
      name: "Account",
      location: `/account/${accountId}`,
      active: true,
    },
    {
      name: "Catalog",
      // location: `/account/${accountId}/catalog`,
    },
  ];

  const handleCatalogCreate = () => {
    showCreateModal();
  };

  const handleCatalogEdit = (trackItem: CatalogItemDisplayData) => {
    console.log("TODO: handle catalog edit");

    // Update the track list
    refetchTracks();
  };

  const handleCatalogRemove = async (trackItem: CatalogItemDisplayData) => {
    // TODO: show a confirmation modal for this

    const data = await runRemoveTrack({ variables: { id: trackItem.id } });

    if (data.errors || !data.data?.removeTrack)
      NotificationManager.showErrorNotification("Unable to delete track.");
    else NotificationManager.showInfoNotification("Track deleted.");

    // Update the track list
    refetchTracks();
  };

  return (
    <PageView
      id="AccountCatalog"
      className={classnames(props.className)}
      style={props.style}
    >
      <PageContent className="AccountCatalog__content">
        <ConfigurationContainer
          className="AccountCatalog__container"
          titleClassName="AccountCatalog__header"
          renderTitle={() => (
            <>
              <BreadcrumbTrail
                className="AccountCatalog__breadcrumb-trail"
                items={breadcrumbItems}
              />
              <IconButton
                className="AccountCatalog__create-button"
                renderIcon={() => <AddIcon />}
                appearance="solid"
                onClick={handleCatalogCreate}
              >
                Create
              </IconButton>
            </>
          )}
        >
          <div className="AccountCatalog__config-container">
            TODO: add search config
          </div>
        </ConfigurationContainer>

        <div className="AccountCatalog__result-container">
          <CatalogDisplay
            className="AccountCatalog__catalog-display"
            tracks={tracks}
            loading={tracksLoading}
            totalTrackNum={totalTracksNum}
            tracksPerPage={TRACKS_PER_PAGE}
            initialPage={initPage}
            configurable={true}
            onPageChange={handleTrackPageChange}
            onEditClick={handleCatalogEdit}
            onRemoveClick={handleCatalogRemove}
          />
        </div>
      </PageContent>
    </PageView>
  );
};

export default AccountCatalog;
