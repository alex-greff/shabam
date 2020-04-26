interface Fingerprint {
    numWindows: number,
    numPartitions: number,
    data: Uint8Array
}

/**
 * The class representation of a fingerprint. 
 * Provides a layer of abstraction from the fingerprint data array.
 */
class Fingerprint {
    /**
     * Initializes a fingerprint instance. If no initial data is provided then all values will be filled with 0.
     * 
     * @param {Number} numWindows The number of windows in the fingerprint (x-axis)
     * @param {Number} numPartitions The number of partitions in the fingerprint (y-axis)
     * @param {Array} initData The initial data (if it exists)
     */
    constructor(numWindows: number, numPartitions: number, initData?: number[]) {
        this.numWindows = numWindows;
        this.numPartitions = numPartitions;

        if (initData) {
            if (initData.length != this.numWindows * this.numPartitions) {
                throw "Size of initial fingerprint data does not match expected size."
            }

            this.data = new Uint8Array(initData);
        } else {
            this.data = new Uint8Array(this.numWindows * this.numPartitions);
            this.data.fill(0);
        }
    }

    /**
     * Retrieves the fingerprint value at the given window and partition point.
     * 
     * @param {Number} window The window index.
     * @param {Number} partition The partition index.
     */
    get(window: number, partition: number): number {
        const size = this.numWindows * this.numPartitions;
        const idx = (window * size) + partition;

        return this.data[idx];
    }

    /**
     * Sets the value of the fingerprint at the given window and partition point.
     * 
     * @param {Number} window The window index.
     * @param {Number} partition The partition index.
     * @param {Number} value The value of the fingerprint (0 or 1).
     */
    set(window: number, partition: number, value: number): void {
        const idx = (window * this.numPartitions) + partition;

        this.data[idx] = value;
    }

    /**
     * Returns a new Uint8Array with the values of the partition column at the given window index.
     * 
     * @param {Number} window The window index.
     */
    getPartitionColumn(window: number): Uint8Array {
        const startIdx = window * this.numPartitions;
        const endIdx = (window * this.numPartitions) + this.numPartitions;

        return this.data.slice(startIdx, endIdx);
    }

    /**
     * Returns a new Uint8Array with the values of the window row at the given partition index.
     * 
     * @param {Numner} partition The partition index.
     */
    getWindowRow(partition: number): Uint8Array {
        const ret = new Uint8Array(this.numWindows);

        // Populate ret
        for (let i = 0; i < ret.length; i++) {
            const dataIdx = (i * this.numPartitions) + partition;

            ret[i] = this.data[dataIdx];
        }

        return ret;
    }

    /**
     * Sets the values of the partition column at the given window index with the given values.
     * 
     * @param {Number} window The window index.
     * @param {Array} values The values for the parititon column.
     */
    setPartitionColumn(window: number, values: number[]): void {
        if (values.length != this.numPartitions) {
            throw "Invalid size of partition values array. Must match with number of partitions";
        }

        // Overwrite the data values in the partition column
        for (let i = 0; i < values.length; i++){
            const dataIdx = (window * this.numPartitions) + i;

            this.data[dataIdx] = values[i];
        }
    }

    /**
     * Sets the values of the window row at the given partition index with the given values.
     * 
     * @param {Number} partition The partition index.
     * @param {Array} values The values for the window row.
     */
    setWindowRow(partition: number, values: number[]): void {
        if (values.length != this.numWindows) {
            throw "Invalid size of window values array. Must match with number of windows";
        }

        // Overwrite the data values in the partition column
        for (let i = 0; i < values.length; i++){
            const dataIdx = (i * this.numPartitions) + partition;

            this.data[dataIdx] = values[i];
        }
    }

    /**
     * Returns a Uint8Array of the flattened fingerprint matrix.
     */
    flatten(): Uint8Array {
        return new Uint8Array(this.data);
    }
}

export default Fingerprint;