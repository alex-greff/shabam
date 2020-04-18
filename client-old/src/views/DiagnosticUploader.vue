<template>
    <div>
        <input 
            ref="audioFile"
            type="file"
            accept="audio/*"
            @change="audioFileChange"
        />

        <spectrogram-chart
            title="Recorded Audio Spectrogram"
            :data="spectrogramData"
            :partition-ranges="partitionRanges"
        />

        <fingerprint-chart 
            title="Generated Audio Fingerprint"
            :data="fingerprintData"
            :partition-ranges="partitionRanges"
        />
    </div>
</template>

<script>
import { AudioRecorder, AudioUtilities, AudioFingerprint } from "@/audio";
import AudioIdentification from "@/identification";
import CONSTANTS from "@/constants";
import SpectrogramChart from "@/components/charts/Spectrogram.vue";
import FingerprintChart from "@/components/charts/Fingerprint.vue";

export default {
    components: {
        spectrogramChart: SpectrogramChart,
        fingerprintChart: FingerprintChart,
    },
    data() {
        return {
            recorder: null,
            running: false,
            spectrogramData: [],
            fingerprintData: [],
            partitionRanges: AudioFingerprint.computePartitionRanges(),
        }
    },
    methods: {
        async audioFileChange() {
            console.log(this.$refs.audioFile.files[0]);

            const audioFile = this.$refs.audioFile.files[0];

            if (!audioFile) {
                console.log("No audio file found");
                return;
            }

            const audioContext = new AudioContext();

            const reader = new FileReader();

            reader.onload = async (e) => {
                console.log("File", e.target.result);

                const audioArrayBuffer = e.target.result;

                const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);

                console.log("Audio buffer", audioBuffer);

                // Generate fingerprint

                const downsampledAudioBuffer = await AudioUtilities.downsample(audioBuffer, CONSTANTS.TARGET_SAMPLE_RATE);

                console.log("Downsampled audio buffer", downsampledAudioBuffer);

                const spectrogramData = await AudioUtilities.computeSpectrogramData(downsampledAudioBuffer);
                this.spectrogramData = spectrogramData;
                console.log("Spectrogram data", spectrogramData);

                console.log("Partition ranges", this.partitionRanges);

                const fingerprintData = AudioFingerprint.generateFingerprint(spectrogramData);
                this.fingerprintData = fingerprintData;
                console.log("Fingerprint", fingerprintData);

                // Send to the server
                console.log("Sending fingerprint to server");
                
                await AudioIdentification.identifyTrack(fingerprintData);
            }

            reader.readAsArrayBuffer(audioFile);
        }
    }
}
</script>

<style>

</style>