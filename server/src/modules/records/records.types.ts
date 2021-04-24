export interface RecordAddress {
  anchorFreq: number;
  pointFreq: number;
  delta: number;
  absoluteTime: number;
}

export interface RecordsTable {
  addresses: RecordAddress[];
  trackId: number;
}

// TODO: remove
// interface RecordAddressBase {
//   anchorFreq: number;
//   pointFreq: number;
//   delta: number;
//   absoluteTime: number;
// }

// interface RecordAddress extends RecordAddressBase {
//   trackId: number;
// }

// abstract class BaseRecordsTable implements Iterable<RecordAddressBase> {
//   protected addresses: RecordAddressBase[] = [];

//   insertRecord(
//     anchorFreq: number,
//     pointFreq: number,
//     delta: number,
//     absoluteTime: number,
//   ) {
//     this.addresses.push({
//       anchorFreq,
//       pointFreq,
//       delta,
//       absoluteTime,
//     });
//   }

//   getRecord(index: number) {
//     return this.addresses[index];
//   }

//   removeRecord(index: number) {
//     this.addresses.splice(index, 1);
//   }

//   *[Symbol.iterator](): Iterator<RecordAddressBase> {
//     for (const address of this.addresses) {
//       yield address;
//     }
//   }
// }

// export class RecordsTable
//   extends BaseRecordsTable
//   implements Iterable<RecordAddressBase> {
//   constructor(private trackId: number) {
//     super();
//   }

//   getRecord(index: number): RecordAddress {
//     return { ...this.addresses[index], trackId: this.trackId };
//   }

//   *[Symbol.iterator](): Iterator<RecordAddress> {
//     for (const address of this.addresses) {
//       yield {
//         ...address,
//         trackId: this.trackId,
//       };
//     }
//   }
// }

// export class RecordsSearchTable extends BaseRecordsTable {}
