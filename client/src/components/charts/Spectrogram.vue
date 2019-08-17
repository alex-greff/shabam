<template>
    <plotly 
        :data="plotlyData"
        :layout="plotlyLayout"
        :display-mode-bar="false"
    />
</template>

<script>
import { Plotly } from "vue-plotly";
import CONSTANTS from "@/constants";
import Utilities from "@/utilities";

export default {
    components: {
        plotly: Plotly
    },
    props: {
        title: {
            type: String,
            required: true
        },
        data: {
            type: Array,
            default: () => []
        },
        windowDuration: {
            type: Number,
            default: CONSTANTS.WINDOW_DURATION
        },
        sampleRate: {
            type: Number,
            default: CONSTANTS.TARGET_SAMPLE_RATE
        },
        FFTSize: {
            type: Number,
            default: CONSTANTS.FFT_SIZE
        },
        colorScale: {
            type: String,
            // Good colorscales: Blackbody, Electric, Greys, Hot, Jet, Virdis, YlGnBu
            default: "Hot"
        }
    },
    computed: {
        x() {
            const aSpectrogramData = this.data;
            return aSpectrogramData.map((_, i_nWindowIndex) => {
                return i_nWindowIndex * this.windowDuration;
            });
        },
        y() {
            const nMaxFreq = 1/2 * this.sampleRate; // Using Nyquist theorem
            const nNumBins = 1/2 * this.FFTSize; // Number of sample bins in FFT is equal to half the FFT (Window) size
            const nFreqPerBin = nMaxFreq / nNumBins;

            const aBinRange = [...Array(nNumBins).keys()];
            return aBinRange.map((_, i_nBinIdx) => {
                return i_nBinIdx * nFreqPerBin;
            });
        },
        z() {
            // Unfortunately the way that the spectrogram data is computed is flipped from how plotly takes it
            // So we must transpose the matrix here

            const aSpectrogramData = this.data;
            const nNumBins = 1/2 * this.FFTSize; // Number of sample bins in FFT is equal to half the FFT (Window) size
            const nNumWindows = aSpectrogramData.length;

            // Initialize the matrix
            const aMatrix = Array(nNumBins).fill(0).map(() => new Uint8Array(nNumWindows));

            // Perform the transpose
            // TODO: probably want to look at a better way of finding the transpose of the matrix
            let nWindowNum, nBinNum = 0;
            for (nWindowNum = 0; nWindowNum < nNumWindows; nWindowNum++) {
                for (nBinNum = 0; nBinNum < nNumBins; nBinNum++) {
                    aMatrix[nBinNum][nWindowNum] = aSpectrogramData[nWindowNum][nBinNum];
                }
            }

            return aMatrix;
        },
        trace() {
            return {
                type: "heatmap",
                x: this.x,
                y: this.y,
                z: this.z,
                colorscale: this.colorScale,
                showscale: false
            }
        },
        plotlyData() {
            return [this.trace];
        },
        plotlyLayout() {
            const bIsEmpty = this.data.length <= 0;
            const nTotalDuration = this.windowDuration * this.data.length;
            const nMaxFreq = (1/2 * this.sampleRate); // Using Nyquist theorem

            return {
                title: { text: this.title },
                xaxis: {
                    title: { text: "Time (s)" },
                    ticks: "Time [s]",
                    showgrid: false,
                    zeroline:false,
                    autorange: false,
                    range: [0, (bIsEmpty) ? 1 : nTotalDuration],
                    // This code snippet ensures the graph is at least 5 seconds long
                    // ...don't know if I really want that
                    // range: [0, Math.max(5, nTotalDuration)],
                },
                yaxis: {
                    title: { text: "Frequency (kHz)" },
                    ticks: "Frequency [kHz]",
                    // type: 'log', 
                    // dtick: 'log_10(2)',
                    showgrid: false,
                    zeroline: false,
                    range: [0, nMaxFreq],
                }
            };
        }
    },
}
</script>

<style lang="sass" scoped>

</style>