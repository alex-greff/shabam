import { Fingerprint } from "../fingerprint/types";

export interface FingerprintCell {
  partition: number;
  window: number;
  cellNum: number;
}

/**
 * Class representation of a fingerprint which provides methods useful for
 * the search process.
 */
export class FingerprintClass implements Iterable<FingerprintCell> {
  constructor(
    public readonly numberOfWindows: number,
    public readonly numberOfPartitions: number,
    private data: Uint32Array
  ) {}

  static fromFingerprintInterface(fingerprint: Fingerprint): FingerprintClass {
    return new FingerprintClass(
      fingerprint.numberOfWindows,
      fingerprint.numberOfPartitions,
      fingerprint.data
    );
  }

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
    if (index >= this.data.length / 2) return null;

    return {
      window: this.data[index * 2],
      partition: this.data[index * 2 + 1],
      cellNum: index,
    };
  }

  public hasCell(index: number): boolean {
    return index < this.data.length / 2;
  }
}
