// TODO: remove
// export interface Fingerprint {
//   numberOfWindows: number;
//   numberOfPartitions: number;
//   data: Uint32Array;
// }

export interface FingerprintCell {
  partition: number;
  window: number;
  cellNum: number;
}

export class Fingerprint implements Iterable<FingerprintCell> {
  constructor(
    public readonly numberOfWindows: number,
    public readonly numberOfPartitions: number,
    private data: Uint32Array,
  ) {}

  *[Symbol.iterator](): Iterator<FingerprintCell> {
    // Iterate through each point of the fingerprint
    for (let i = 0; i < this.data.length / 2; i++) {
      const currWindow = this.data[i * 2];
      const currPartition = this.data[i * 2 + 1];

      yield {
        partition: currPartition,
        window: currWindow,
        cellNum: i,
      };
    }
  }

  public getCell(index: number): FingerprintCell | null {
    if (index > this.data.length / 2) return null;

    return {
      partition: this.data[index * 2],
      window: this.data[index * 2 + 1],
      cellNum: index,
    };
  }
}
