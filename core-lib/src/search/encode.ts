import { Address, Couple } from "./types";

export function encodeAddress({ anchorFreq, pointFreq, delta }: Address): number {
  // Check that we can actually encode it in a 32-bit integer
  const PARTITION_MAX = 512; // 2^9
  const DELTA_MAX = 16384; // 2^14
  if (
    anchorFreq > PARTITION_MAX ||
    pointFreq > PARTITION_MAX ||
    delta > DELTA_MAX
  )
    throw 'An input value is too big';

  // Bit layout:
  // |                        32-bit integer                         |
  // |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
  // |   anchor freq   |    point freq   |           delta           |

  let encoded = anchorFreq; // add anchorFreq
  encoded = encoded << 9; // make space for pointFreq
  encoded = encoded | pointFreq; // add pointFreq
  encoded = encoded << 14; // make space for delta
  encoded = encoded | delta; // add delta

  return encoded;
}

export function decodeAddress(address: number): Address {
  // Bit layout:
  // |                        32-bit integer                         |
  // |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
  // |   anchor freq   |    point freq   |           delta           |

  // 11111111100000000000000000000000
  // = 511 << 23
  // = -8388608
  const ANCHOR_MASK = -8388608;

  // 00000000011111111100000000000000
  // = 511 << 14
  // = 8372224
  const POINT_MASK = 8372224;

  // 00000000000000000011111111111111
  const DELTA_MASK = 16383;

  const anchorFreq = (address & ANCHOR_MASK) >> 23;
  const pointFreq = (address & POINT_MASK) >> 14;
  const delta = address & DELTA_MASK;

  return {
    anchorFreq,
    pointFreq,
    delta,
  };
}

export function encodeCouple({ absTime, trackId }: Couple): bigint {
  // Bit layout
  // |                          64-bit integer                         |
  // |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  // |            absTime             |             trackId            |

  let encoded = BigInt(absTime); // add absTime
  encoded = encoded << BigInt(32); // make space for trackId
  encoded = encoded | BigInt(trackId); // add trackId

  return encoded;
}

export function decodeCouple(couple: bigint): Couple {
  // Bit layout
  // |                          64-bit integer                         |
  // |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  // |            absTime             |             trackId            |

  // 1111111111111111111111111111111100000000000000000000000000000000
  // 4294967295n << 32n
  // 18446744069414584320n
  const ABS_TIME_MASK = BigInt("18446744069414584320");

  // 11111111111111111111111111111111
  const TRACK_ID_MASK = BigInt(4294967295);

  const absTime = Number((couple & ABS_TIME_MASK) >> BigInt(32));
  const trackId = Number(couple & TRACK_ID_MASK);

  return {
    absTime,
    trackId,
  };
}