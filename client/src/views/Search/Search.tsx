import React, { FunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./Search.scss";
import classnames from "classnames";
import * as NotificationManager from "@/managers/NotificationManager";
import * as AudioUtilities from "@/audio/utilities";

import PageView from "@/components/page/PageView/PageView";
import { useSearchMutation } from "@/graphql-apollo.g.d";
import { WasmFingerprintGenerator } from "@/fingerprint/WasmFingerprintGenerator";

const fingerprintGenerator = new WasmFingerprintGenerator();

export interface Props extends Omit<BaseProps, "id"> {}

const Search: FunctionComponent<Props> = (props) => {
  const [runSearchMutation, { data }] = useSearchMutation();

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // const temp = () =>
  //   NotificationManager.showNotification(
  //     "success",
  //     "hi wad awd a dawdwadadawd",
  //     500000
  //   );

  const audioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = e.target.files ? e.target.files[0] : null;
    setAudioBlob(audioFile);
  };

  const searchFingerprint = async () => {
    if (audioBlob == null) {
      NotificationManager.showErrorNotification("No audio file.");
    }

    const audioBuffer = await AudioUtilities.convertBlobToAudioBuffer(
      audioBlob!
    );

    const downsampledAudioBuffer = await AudioUtilities.downsample(audioBuffer);

    const spectrogramData = await AudioUtilities.computeSpectrogramData(
      downsampledAudioBuffer
    );

    const fingerprint = await fingerprintGenerator.generateFingerprint(spectrogramData);

    if (fingerprint === null) {
      NotificationManager.showErrorNotification("Failed to generate fingerprint.");
      return;
    }

    // const fingerprintDataBlob = new Blob([fingerprint.data], { type: 'text/plain' });
    const fingerprintDataBlob = new Blob([fingerprint.data], { type: 'application/octet-stream' });

    console.log(fingerprintDataBlob);

    const searchResult = await runSearchMutation({ variables: { fingerprint: { 
      numberOfWindows: fingerprint.numberOfWindows,
      numberOfPartitions: fingerprint.numberOfPartitions,
      fingerprintData: fingerprintDataBlob
    }}});

    console.log("Search result", searchResult.data?.search);
  };

  return (
    <PageView
      id="Search"
      className={classnames(props.className)}
      style={props.style}
    >
      Search View
      {/* <br />
      <button onClick={temp}>Click Me</button> */}
      <br />
      <input 
        type="file" 
        name="audio" 
        accept="audio/wav, audio/mp3"
        onChange={audioFileChange}
      />
      <br />
      <button disabled={!audioBlob} onClick={searchFingerprint}>Search</button>
    </PageView>
  );
};

export default Search;
