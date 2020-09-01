import {
  FingerprintGeneratorFunction,
  FingerprintGeneratorOptions,
  SpectrogramData,
  Fingerprint,
  PartitionRanges,
} from "@/audio/types";
import { WasmModuleWrapper } from "@/loaders/WASMLoader";
import FingerprintModule from "@/wasm-types/fingerprint.types";
import * as AudioConstants from "@/audio/constants";
import { computePartitionRanges } from "../utilities";

const wasmModule = new WasmModuleWrapper<FingerprintModule>(
  import("@WASM/fingerprint.js"),
  import("@WASM/fingerprint.wasm")
);
wasmModule.initialize();

const defaultOptions: FingerprintGeneratorOptions = {
  FFTSize: AudioConstants.FFT_SIZE,
  partitionAmount: AudioConstants.FINGERPRINT_PARTITION_AMOUNT,
  partitionCurve: AudioConstants.FINGERPRINT_PARTITION_CURVE,
};

/**
 * Prepares the given fingerprint module for the generate function call,
 * allocating and setting up `spectrogramData` and `optionsPartial` into
 * the module's address space.
 */
function prepareFingerprintModule(
  fingerprintModule: FingerprintModule,
  spectrogramData: SpectrogramData,
  options: FingerprintGeneratorOptions
) {
  // Make sure the global options are initialized
  if (!fingerprintModule._global_fingerprint_options_initialized()) {
    fingerprintModule._initialize_global_fingerprint_options(
      AudioConstants.FINGERPRINT_PARTITION_AMOUNT,
      AudioConstants.FINGERPRINT_PARTITION_CURVE,
      AudioConstants.FINGERPRINT_SLIDER_WIDTH,
      AudioConstants.FINGERPRINT_SLIDER_HEIGHT,
      AudioConstants.FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER
    );
  }

  // Compute partition ranges
  const partitionRanges = computePartitionRanges(
    options.partitionAmount,
    options.FFTSize,
    options.partitionCurve
  );
  const numPartitionRanges = partitionRanges.length;
  const m_partitionRangesPtr = fingerprintModule._malloc(
    numPartitionRanges * 2 * Int32Array.BYTES_PER_ELEMENT
  );

  // Move to WASM module's heap
  for (let i = 0; i < numPartitionRanges; i++) {
    const baseIdx = m_partitionRangesPtr / 4 + i * 2;
    fingerprintModule.HEAP32[baseIdx] = partitionRanges[i][0];
    fingerprintModule.HEAP32[baseIdx + 1] = partitionRanges[i][1];
  }

  // Allocate and setup the options struct in the wasm module's address space
  const m_optionsPtr = fingerprintModule._create_fingerprint_options(
    options.partitionAmount,
    m_partitionRangesPtr,
    numPartitionRanges
  );

  // Allocate memory for the data array and copy it over
  const m_dataPtr = fingerprintModule._malloc(spectrogramData.data.byteLength);
  fingerprintModule.HEAPU8.set(spectrogramData.data, m_dataPtr);

  // Allocate and setup the spectrogram data in the wasm module's address space
  const m_specDataPtr = fingerprintModule._create_spectrogram_data(
    spectrogramData.numberOfWindows,
    spectrogramData.frequencyBinCount,
    m_dataPtr
  );

  return {
    m_optionsPtr,
    m_dataPtr,
    m_specDataPtr,
  };
}

/**
 * Converts the fingerprint located at `m_fingerprintPtr` in the fingerprint
 * module `fingerprintModule` to the JavaScript representation of it.
 */
function convertFingerprintResults(
  fingerprintModule: FingerprintModule,
  m_fingerprintPtr: number
): Fingerprint | null {
  if (m_fingerprintPtr === 0) return null;

  const num_windows = fingerprintModule.HEAP32[m_fingerprintPtr / 4];
  const num_freq_bins = fingerprintModule.HEAP32[m_fingerprintPtr / 4 + 1];
  const num_partitions = fingerprintModule.HEAP32[m_fingerprintPtr / 4 + 2];

  const data_ptr = fingerprintModule.HEAPU32[m_fingerprintPtr / 4 + 3];
  const num_data_pair = fingerprintModule.HEAP32[m_fingerprintPtr / 4 + 4];

  // Make a copy of the data pair array
  const data_pairs = fingerprintModule.HEAPU32.slice(
    data_ptr / 4,
    data_ptr / 4 + num_data_pair * 2
  );

  const partition_ranges_ptr =
    fingerprintModule.HEAP32[m_fingerprintPtr / 4 + 5];
  const num_partition_ranges =
    fingerprintModule.HEAP32[m_fingerprintPtr / 4 + 6];

  const partitionRanges: PartitionRanges = [];

  // Construct partition ranges
  for (let i = 0; i < num_partition_ranges; i++) {
    const baseIdx = partition_ranges_ptr / 4 + i * 2;
    const startRange = fingerprintModule.HEAP32[baseIdx];
    const endRange = fingerprintModule.HEAP32[baseIdx + 1];
    partitionRanges.push([startRange, endRange]);
  }

  return {
    numberOfWindows: num_windows,
    numberOfPartitions: num_partitions,
    frequencyBinCount: num_freq_bins,
    data: data_pairs,
    partitionRanges: partitionRanges,
  };
}

export const generateFingerprint: FingerprintGeneratorFunction = async (
  spectrogramData,
  optionsPartial
) => {
  let fingerprint: Fingerprint | null = null;

  try {
    await wasmModule.loaderPromise;

    // console.log(wasmModule.module); // TODO: remove

    if (wasmModule.module == null) throw "Failed to load module";

    const fingerprintModule = wasmModule.module!;

    const optionsFull: FingerprintGeneratorOptions = {
      ...defaultOptions,
      ...optionsPartial,
    };

    // Prepare the module
    const argData = prepareFingerprintModule(
      fingerprintModule,
      spectrogramData,
      optionsFull
    );

    // Run fingerprint generation
    const m_fingerprintPtr = fingerprintModule._generate_fingerprint(
      argData.m_specDataPtr,
      argData.m_optionsPtr
    );

    fingerprint = convertFingerprintResults(
      fingerprintModule,
      m_fingerprintPtr
    );

    // Free up module resources
    // Note: _free_spectrogram_data handles freeing argData.m_dataPtr for us
    // and _free_fingerprint_options handles freeing m_partitionRangesPtr
    fingerprintModule._free_fingerprint_options(argData.m_optionsPtr);
    fingerprintModule._free_spectrogram_data(argData.m_specDataPtr);
    fingerprintModule._free_fingerprint(m_fingerprintPtr);
  } catch (err) {
    console.log("Failed to run fingerprint generator wasm module", err);
  }

  if (fingerprint == null) {
    throw "Unable to generate fingerprint.";
  }

  return fingerprint;
};
