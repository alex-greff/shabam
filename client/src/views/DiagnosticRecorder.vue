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
import initializeRecorder from "@/recorder";
import { Plotly } from 'vue-plotly'

// import spectrogramData from "@TEST-DATA/spectrogram";

import mainJS from "@WASM/main-wasm.js";
// const mainJS = require("@WASM/main-wasm.js");
// const mainJS = require("@WASM/main-wasm.js");
// require("../../wasm/main-wasm.js")
// const mainJS = require("exports-loader?Module!../../wasm/main-wasm.js");
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
        console.log(mainJS);
        console.log(mainWASM);

        const mainModule = mainJS({
            locateFile(path) {
                console.log("PATH", path);
                if(path.endsWith('.wasm')) {
                    return mainWASM;
                }
                return path;
            }
        });

        mainModule.onRuntimeInitialized = () => {
            console.log("MODULE", mainModule);
            console.log("TEST", mainModule._test(8))
        };
    },
    methods: {
        async start() {
            // NOTE: Just assumes that the microphone is allowed for now
            this.recorder = await initializeRecorder();
            this.recorder.start();
            this.running = true;
        },
        async stop() {
            const audio = await this.recorder.stop();
            this.running = false;

            console.log("Audio", audio);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

