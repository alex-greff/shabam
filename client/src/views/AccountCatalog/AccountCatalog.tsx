import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./AccountCatalog.scss";
import classnames from "classnames";
import { useAccountLocation } from "@/hooks/useAccountLocation";
import * as Utilities from "@/utilities";
import { WasmFingerprintGenerator } from "@/fingerprint/WasmFingerprintGenerator";
import * as AudioUtilities from "@/audio/utilities";
import * as NotificationManager from "@/managers/NotificationManager";
import * as GraphqlTransformers from "@/utilities/graphqlTransformers";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import BreadcrumbTrail, {
  BreadcrumbTrailItem,
} from "@/components/nav/BreadcrumbTrail/BreadcrumbTrail";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";
import IconButton from "@/components/ui/buttons/IconButton/IconButton";
import AddIcon from "@material-ui/icons/Add";
import CatalogDisplay from "@/components/catalog/CatalogDisplay/CatalogDisplay";

import { useCatalogConfigureModal } from "@/hooks/modals/catalog/useCatalogConfigureModal";
import { CatalogItemData } from "@/components/modals/catalog/CatalogConfigureModal/CatalogConfigureModal";
import { useAddTrackMutation } from "@/graphql-apollo.g.d";

export interface Props extends Omit<BaseProps, "id"> {}

const wasmFpGenerator = new WasmFingerprintGenerator();

const AccountCatalog: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();
  const [addTrack] = useAddTrackMutation();

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
          <CatalogDisplay />
        </div>
      </PageContent>
    </PageView>
  );
};

export default AccountCatalog;
