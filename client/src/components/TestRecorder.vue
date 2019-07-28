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
import testModule from "../../wasm/hello.wasm";

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

        const test = testModule().then(({instance}) => {
            console.log("TEST WASM MODULE EXPORTS", instance.exports);
        });


        // var importObject = {
        //     imports: { imported_func: arg => console.log(arg) }
        // };

        // fetch("hello.wasm").then(response => 
        //     response.arrayBuffer()
        // ).then(bytes => 
        //     WebAssembly.instantiate(bytes, importObject)
        // ).then(results => {
        //     console.log(results.instance.exports);
        // })
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

            const audioBlob = audio.audioBlob;
            const arrayBuffer = await new Response(audioBlob).arrayBuffer();
            const audioContext = new AudioContext();

            const buffer = await audioContext.decodeAudioData(arrayBuffer);
            const channelData = buffer.getChannelData(0);

            const audioFile = new File([audioBlob], "audioFile", { type: 'audio/wav; codecs=MS_PCM', lastModified: Date.now() });

            console.log("AUDIO BLOB", audioBlob);
            console.log("AUDIO FILE", audioFile);
            // console.log("ARRAY BUFFER", arrayBuffer);
            // console.log("BUFFER", buffer);
            // console.log("CHANNEL DATA", channelData);

            try {
                const operations = {
                    query: `
                        query SearchTrack($audioFile: Upload!) {
                            searchTrack(audioFile: $audioFile) {
                                _id,
                                fingerprintData,
                                metaData {
                                    title,
                                    artists,
                                    coverImage,
                                    uploaderEmail,
                                    releaseDate,
                                    createdDate,
                                    updatedDate
                                }
                            }
                        }
                    `,
                    variables: {
                        audioFile: null
                    }
                };

                const map = {
                    "0": ["variables.audioFile"]
                };

                const fd = new FormData();
                fd.append("operations", JSON.stringify(operations));
                fd.append("map", JSON.stringify(map));
                fd.append(0, audioFile, audioFile.name);

                const res = await this.$http.post("/api/graphql", fd, {
                    headers: {
                        "Content-Type": `multipart/form-data; boundary=${fd._boundary}`
                    }
                });

                console.log("RES", res);
            } catch(err) {
                console.log("ERROR", err.response.data.errors);
            }

            // let reader =  new FileReader();
            // reader.onload = async (e) => {
            //     try {
            //         const operations = {
            //             query: `
            //                 query SearchTrack($audioFile: Upload!) {
            //                     searchTrack(audioFile: $audioFile) {
            //                         _id,
            //                         fingerprintData,
            //                         metaData {
            //                             title,
            //                             artists,
            //                             coverImage,
            //                             uploaderEmail,
            //                             releaseDate,
            //                             createdDate,
            //                             updatedDate
            //                         }
            //                     }
            //                 }
            //             `,
            //             variables: {
            //                 audioFile: null
            //             }
            //         };

            //         const map = {
            //             "0": ["variables.audioFile"]
            //         };

            //         const fd = new FormData();
            //         fd.append("operations", JSON.stringify(operations));
            //         fd.append("map", JSON.stringify(map));
            //         fd.append(0, e.target.result);

            //         const res = await this.$http.post("/api/graphql", fd);

            //         console.log("RES", res);
            //     } catch(err) {
            //         console.log("ERROR", err.response.data.errors);
            //     }
            // };

            // reader.readAsDataURL(audio.audioBlob);
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

