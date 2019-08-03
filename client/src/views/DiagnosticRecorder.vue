<template>
    <div>
        Diagnostic Recorder
        <div>
            <button @click="start" :disabled="running">Start</button>
            <button @click="stop" :disabled="!running">Finish</button>
        </div>
    </div>
</template>

<script>
import Utilities from "@/utilities";
import initializeRecorder from "@/recorder";

export default {
    data() {
        return {
            recorder: null,
            running: false
        }
    },
    mounted() {
        console.log("Plotly", Utilities.plotly);
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

<style>

</style>
