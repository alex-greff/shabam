import { SpectrogramData, PartitionRanges } from "@/audio/types";

interface ComputedVales {
    [storageKey: string]: number;
}

export class MeanStorage {
    private spectrogramData: SpectrogramData;
    private partitionRanges: PartitionRanges;
    private computedValues: ComputedVales = {};

    /**
     * Initializes a mean storage instance.
     * 
     * @param spectrogramData The spectrogram data.
     * @param partitionRanges The computed partition ranges.
     */
    constructor(spectrogramData: SpectrogramData, partitionRanges: PartitionRanges) {
        this.spectrogramData = spectrogramData;
        this.partitionRanges = partitionRanges;
    }

    /**
     * Checks the given coordinates and throws any errors if invalid.
     * 
     * @param window The index of the window.
     * @param partition The index of the frequency bin partition.
     */
    private checkCoordinates(window: number, partition: number): void | never {
        if (window < 0 || window >= this.spectrogramData.numberOfWindows) {
            throw `Invalid window index '${window}'`;
        }

        if (partition < 0 || partition >= this.spectrogramData.frequencyBinCount) {
            throw `Invalid partition index '${partition}'`;
        }
    }

    /**
     * Gets the key of the storage map for the given window-partition coordinate.
     * 
     * @param window The index of the window.
     * @param partition The index of the frequency bin partition.
     */
    private getStorageMapKey(window: number, partition: number) {
        return `${window}:${partition}`;
    }

    /**
     * Gets the mean value of the cell located at the given window-partition coordinate.
     * 
     * @param window The index of the window.
     * @param partition The index of the frequency bin partition.
     * @param recompute Force recomputation of the mean value, even if it already exists.
     */
    getCellMean(window: number, partition: number, recompute = false) {
        this.checkCoordinates(window, partition);

        const storageKey = this.getStorageMapKey(window, partition);

        const meanAlreadyComputed = !!this.computedValues[storageKey];

        // Compute the mean value, if needed
        if (!meanAlreadyComputed || recompute) {
            const partitionRange = this.partitionRanges[partition];
            const binStartIdx = partitionRange[0];
            const binEndIdx = partitionRange[1];
            const { frequencyBinCount, data } = this.spectrogramData;

            const spectrogramStartIdx = window * frequencyBinCount + binStartIdx;
            const spectrogramEndIdx = window * frequencyBinCount + binEndIdx;

            const frequencyPartitionSlice = data.slice(spectrogramStartIdx, spectrogramEndIdx);

            // Calculate the partition mean value
            let partitionMean = 0;
            for (let i=0; i < frequencyPartitionSlice.length; i++) {
                const currVal = frequencyPartitionSlice[i];
                partitionMean += currVal;
            }
            partitionMean = Math.round(partitionMean / frequencyPartitionSlice.length);

            // Store the computed mean
            this.computedValues[storageKey] = partitionMean;
        }

        return this.computedValues[storageKey];
    }
}