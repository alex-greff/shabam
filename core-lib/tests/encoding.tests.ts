import CoreLibNative from "../build/Release/core_lib_native.node";

console.log("exports", CoreLibNative);

function testAddress(
  anchorFreq: number,
  pointFreq: number,
  delta: number,
  expectError = false,
  expectedOverride: [number, number, number] | null = null
) {
  try {
    const encoded = CoreLibNative.RecordsEngine.encodeAddress(
      anchorFreq,
      pointFreq,
      delta
    );

    const [anchorFreqDecoded, pointFreqDecoded, deltaDecoded] =
      CoreLibNative.RecordsEngine.decodeAddress(encoded);

    const anchorFreqExpected =
      expectedOverride !== null ? expectedOverride[0] : anchorFreq;
    const pointFreqExpected =
      expectedOverride !== null ? expectedOverride[1] : pointFreq;
    const deltaExpected =
      expectedOverride !== null ? expectedOverride[2] : delta;

    if (
      anchorFreqDecoded !== anchorFreqExpected ||
      pointFreqDecoded !== pointFreqExpected ||
      deltaDecoded !== deltaExpected
    ) {
      console.log(
        `> (Failed): address (${anchorFreq}, ${pointFreq}, ${delta}) => ${encoded}, expected (${anchorFreqExpected}, ${pointFreqExpected}, ${deltaExpected}) but got (${anchorFreqDecoded}, ${pointFreqDecoded}, ${deltaDecoded})`
      );
    } else {
      console.log(
        `(Passed): address (${anchorFreq}, ${pointFreq}, ${delta}) => ${encoded} => (${anchorFreqExpected}, ${pointFreqExpected}, ${deltaExpected})`
      );
    }
  } catch (err) {
    if (expectError) {
      console.log(
        `(Passed): address (${anchorFreq}, ${pointFreq}, ${delta}) threw error "${err}"`
      );
    } else {
      console.log(
        `(Failed): address (${anchorFreq}, ${pointFreq}, ${delta}) threw error "${err}"`
      );
    }
  }
}

function testCouple(
  absTime: number,
  trackId: number,
  expectError = false,
  expectedOverride: [number, number] | null = null
) {
  try {
    const encoded = CoreLibNative.RecordsEngine.encodeCouple(absTime, trackId);

    const [absTimeDecoded, trackIdDecoded] =
      CoreLibNative.RecordsEngine.decodeCouple(encoded);

    const absTimeExpected =
      expectedOverride !== null ? expectedOverride[0] : absTime;
    const trackIdExpected =
      expectedOverride !== null ? expectedOverride[1] : trackId;

    if (
      absTimeDecoded !== absTimeExpected ||
      trackIdDecoded !== trackIdExpected
    ) {
      console.log(
        `> (Failed): couple (${absTime}, ${trackId}) => ${encoded}, expected (${absTimeExpected}, ${trackIdExpected}) but got (${absTimeDecoded}, ${trackIdDecoded})`
      );
    } else {
      console.log(
        `(Passed): couple (${absTime}, ${trackId}) => ${encoded} => (${absTimeExpected}, ${trackIdExpected})`
      );
    }
  } catch (err) {
    if (expectError) {
      console.log(
        `(Passed): couple (${absTime}, ${trackId}) threw error "${err}"`
      );
    } else {
      console.log(
        `(Failed): couple (${absTime}, ${trackId}) threw error "${err}"`
      );
    }
  }
}

(async function () {
  console.log("Testing addressed:");
  testAddress(0, 0, 0);
  testAddress(1, 2, 3);
  testAddress(65535, 65535, 4294967295); // Limits
  // Limits with underflow
  testAddress(65535, 65535, -1, false, [65535, 65535, 4294967295]);
  testAddress(65536, 0, 0, true); // Anchor freq over limit
  testAddress(0, 65536, 0, true); // Point freq over limit
  testAddress(0, 0, 4294967296, false, [0, 0, 0]); // Delta over limit
  testAddress(-1, 0, 0, true); // Underflow anchor freq
  testAddress(0, -1, 0, true); // Underflow point freq
  // Underflow delta
  testAddress(0, 0, -1, false, [0, 0, 4294967295]);

  console.log();
  console.log("Testing couples:");
  testCouple(0, 0);
  testCouple(1, 2);
  testCouple(4294967295, 4294967295); // Limits
  // Limits with underflow
  testCouple(-1, -1, false, [4294967295, 4294967295]);
  testCouple(4294967296, 0, false, [0, 0]); // Abs time over limit
  testCouple(0, 4294967296, false, [0, 0]); // Track id over limit
})();
