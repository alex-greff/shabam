<template>
    <div>
        Diagnostic Recorder
        <div>
            <button @click="start" :disabled="running">Start</button>
            <button @click="stop" :disabled="!running">Finish</button>
        </div>
        
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

import mainJS from "@WASM/main-wasm.js";
import mainWASM from "@WASM/main-wasm.wasm";

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
    mounted() {
        // console.log(mainJS);
        // console.log(mainWASM);

        // const mainModule = mainJS({
        //     locateFile(path) {
        //         console.log("PATH", path);
        //         if(path.endsWith('.wasm')) {
        //             return mainWASM;
        //         }
        //         return path;
        //     }
        // });

        // mainModule.onRuntimeInitialized = () => {
        //     console.log("MODULE", mainModule);
        //     console.log("TEST", mainModule._test(8))
        // };

        console.log(this.$wasm);
        // console.log(this.$wasm.main.test(8));
    },
    methods: {
        async start() {
            // NOTE: Just assumes that the microphone is allowed for now
            this.recorder = await AudioRecorder.create();
            this.recorder.start();
            this.running = true;
        },
        async stop() {
            const audio = await this.recorder.stop();
            this.running = false;

            console.log("Audio", audio);

            const downsampledAudioBuffer = await AudioUtilities.downsample(audio.audioBuffer, CONSTANTS.TARGET_SAMPLE_RATE);

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





            // Bunch of extra code, will remove eventually

            // const audioContext = new OfflineAudioContext(
            //     downsampledAudioBuffer.numberOfChannels,
            //     downsampledAudioBuffer.length,
            //     downsampledAudioBuffer.sampleRate
            // );
            // const sourceNode = new AudioBufferSourceNode(audioContext, { buffer: downsampledAudioBuffer });
            // const analyserNode = new AnalyserNode(audioContext, { fftSize: CONSTANTS.FFT_SIZE });

            // sourceNode.connect(audioContext.destination);
            // sourceNode.connect(analyserNode);
            // sourceNode.start();
            // await audioContext.startRendering();

            // const freqData = new Uint8Array(analyserNode.frequencyBinCount);
            // analyserNode.getByteFrequencyData(freqData);

            // console.log(analyserNode.frequencyBinCount, freqData);

            // const frequencyData = await AudioUtilities.computeFrequencyData(downsampledAudioBuffer);
            // console.log("Frequency Data for first window", frequencyData);


            // Plays back the downsampled audio
            // const audioCtx = new AudioContext();
            // const source = audioCtx.createBufferSource();
            // source.buffer = downsampledAudioBuffer;
            // source.connect(audioCtx.destination);
            // source.start(0);

            // const offlineCtx = new OfflineAudioContext(
            //     downsampledAudioBuffer.numberOfChannels,
            //     downsampledAudioBuffer.length,
            //     downsampledAudioBuffer.sampleRate
            // );
            // const source = offlineCtx.createBufferSource();
            // source.buffer = downsampledAudioBuffer;
            // source.connect(offlineCtx.destination);
            // source.start(0);

            // const analyser = offlineCtx.createAnalyser();
            // analyser.fftSize = 256;
            // const bufferLength = analyser.frequencyBinCount;
            // console.log(bufferLength);
            // const dataArray = new Uint8Array(bufferLength);
            // analyser.getByteFrequencyData(dataArray);
            // console.log(dataArray);
        

            // const analyser = audioCtx.createAnalyser();
            // analyser.fftSize = 256;
            // const bufferLength = analyser.frequencyBinCount;

            // console.log(bufferLength);

            // const dataArray = new Uint8Array(bufferLength);
            // analyser.getByteFrequencyData(dataArray);

            // console.log(dataArray);

            

        }
    }
}
</script>

<style lang="scss" scoped>

</style>

