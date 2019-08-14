<template>
    <div>
        Diagnostic Recorder
        <div>
            <button @click="start" :disabled="running">Start</button>
            <button @click="stop" :disabled="!running">Finish</button>
        </div>
        <!-- <plotly 
            :data="testData" 
            :layout="testLayout" 
            :display-mode-bar="false"
        /> -->
    </div>
</template>

<script>
import { AudioRecorder, AudioUtilities } from "@/audio";
import { Plotly } from 'vue-plotly'

import spectrogramData from "@TEST-DATA/spectrogram";

import mainJS from "@WASM/main-wasm.js";
import mainWASM from "@WASM/main-wasm.wasm";

export default {
    components: {
        // plotly: Plotly
    },
    data() {
        return {
            recorder: null,
            running: false,
            // testData: spectrogramData.data,
            // testLayout: spectrogramData.layout,
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

            const downsampledAudioBuffer = await AudioUtilities.downsample(audio.audioBuffer, 16000);

            console.log("Downsampled audio buffer", downsampledAudioBuffer);

            // const offlineCtx = new OfflineAudioContext

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

