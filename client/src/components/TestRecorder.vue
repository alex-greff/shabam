<template>
    <div class="TestRecorder">
        <button @click="start" :disabled="!inactive">Start</button>
        <button @click="pause" :disabled="paused || inactive">Pause</button>
        <button @click="resume" :disabled="!paused">Resume</button>
        <button @click="stop" :disabled="!recording">Stop</button>
    </div>
</template>

<script>
import initializeRecorder from "@/recorder";

export default {
    data() {
        return {
            recorder: null,
            state: "inactive"
        }
    },
    async mounted() {
        // try {
        //     const recorder = await initializeRecorder();
        //     console.log(recorder);
        // } catch(err) {
        //     console.log(err.toString());
        // }
    },
    computed: {
        inactive() {
            return this.state === "inactive";
        },
        recording() {
            return this.state === "recording";
        },
        paused() {
            return this.state === "paused";
        }
    },
    methods: {
        async start() {
            // NOTE: Just assumes that the microphone is allowed for now
            this.recorder = await initializeRecorder();
            this.recorder.start();
            this.state = this.recorder.getState();
        },
        pause() {
            this.recorder.pause();
            this.state = this.recorder.getState();
        },
        resume() {
            this.recorder.resume();
            this.state = this.recorder.getState();
        },
        async stop() {
            const audio = await this.recorder.stop();
            this.state = this.recorder.getState();

            console.log("Audio", audio);

            const arrayBuffer = await new Response(audio.audioBlob).arrayBuffer();

            const audioContext = new AudioContext();

            const buffer = await audioContext.decodeAudioData(arrayBuffer);
            const channelData = buffer.getChannelData(0);

            console.log("BUFFER", buffer);
            console.log("CHANNEL DATA", channelData);
        }
    }
}
</script>

<style lang="scss" scoped>
    .TestRecorder {
        & button:not(:last-child) {
            margin-right: 1rem;
        }
    }
</style>

