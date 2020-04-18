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
        plotly: Plotly,
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
        partitionRanges: {
            type: Array,
            required: true,
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
    },
    computed: {
        partitions() {
            return this.partitionRanges.map(i_aPartitionRange => {
                const nBinSize = this.FFTSize / 2;
                const nMaxFreq = this.sampleRate / 2;
                const nNormalizeMult = nMaxFreq / nBinSize;

                const nAverage = (i_aPartitionRange[0] + i_aPartitionRange[1]) / 2;

                return nAverage * nNormalizeMult;
            });
        },
        plotlyData() {
            const aFingerprintData = this.data;
            const nPartitionNum = (aFingerprintData[0]) ? aFingerprintData[0].length : 0;

            const aPartitionRange = [...Array(nPartitionNum).keys()];
            const aTraces = aPartitionRange.map((i_nCurrPartition) => {
                // Filter only the x data points that the current partition has a point for
                const aXData = aFingerprintData.reduce((acc, i_aCurrWindow, i_nWindowIndex) => {
                    const bHasPoint = !!i_aCurrWindow[i_nCurrPartition];
                    const nCurrTime = i_nWindowIndex * this.windowDuration + (this.windowDuration/2);

                    return (bHasPoint) ? [...acc, nCurrTime] : [...acc];
                }, []);

                // Fill the y-axis with the current partition number
                const aYData = Array(aXData.length).fill(this.partitions[i_nCurrPartition]);

                // Return the trace
                return {
                    x: aXData,
                    y: aYData,
                    type: "scatter",
                    mode: "markers",
                    name: `Band ${i_nCurrPartition + 1}`,
                    // hoverinfo: "skip", // Hides the hover information
                };
            });

            return aTraces;
        },
        plotlyLayout() {
            const bIsEmpty = this.data.length <= 0;
            const nTotalDuration = this.windowDuration * this.data.length;
            const nMaxFreq = (1/2 * this.sampleRate); // Using Nyquist theorem

            return {
                title: { text: this.title },
                showlegend: false,
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
                    range: [0, nMaxFreq],
                    showgrid: false,
                    zeroline: false,
                }
            };
        }
    }
}
</script>

<style>

</style>