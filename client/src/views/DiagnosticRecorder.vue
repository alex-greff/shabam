<template>
    <div>
        Diagnostic Recorder
        <div>
            <button @click="start" :disabled="running">Start</button>
            <button @click="stop" :disabled="!running">Finish</button>
        </div>
        <plotly 
            :data="testData" 
            :layout="testLayout" 
            :display-mode-bar="false"
        />
    </div>
</template>

<script>
import initializeRecorder from "@/recorder";
import { Plotly } from 'vue-plotly'

import spectrogramData from "@/_sampleData/spectrogram";

export default {
    components: {
        plotly: Plotly
    },
    data() {
        return {
            recorder: null,
            running: false,
            testData: spectrogramData.data,
            testLayout: spectrogramData.layout,
        }
    },
    mounted() {
        
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

