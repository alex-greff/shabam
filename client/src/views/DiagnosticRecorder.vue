<template>
    <div>
        Diagnostic Recorder
        <div>
            <button @click="start" :disabled="running">Start</button>
            <button @click="stop" :disabled="!running">Finish</button>
        </div>
        
        <spectrogram 
            title="Recorded Audio Spectrogram"
            :data="spectrogramData"
        />

        <!-- <plotly 
            :data="testData" 
            :layout="testLayout" 
            :display-mode-bar="false"
        /> -->
    </div>
</template>

<script>
import { AudioRecorder, AudioUtilities } from "@/audio";
import CONSTANTS from "@/constants";
import { Plotly } from 'vue-plotly'
import Spectrogram from "@/components/charts/Spectrogram.vue";

// import spectrogramData from "@TEST-DATA/spectrogram";

import mainJS from "@WASM/main-wasm.js";
import mainWASM from "@WASM/main-wasm.wasm";

export default {
    components: {
        // plotly: Plotly,
        spectrogram: Spectrogram,
    },
    data() {
        return {
            recorder: null,
            running: false,
            // testData: spectrogramData.data,
            // testLayout: spectrogramData.layout,
            spectrogramData: []
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

        // console.log(this.$wasm);
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
            const spectrogramData = await AudioUtilities.computeSpectrogramData(downsampledAudioBuffer);
            console.log("Spectrogram data", spectrogramData);

            this.spectrogramData = spectrogramData;


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

