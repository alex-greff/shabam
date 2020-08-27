import {
  FingerprintGeneratorFunction,
  FingerprintGeneratorOptions,
  SpectrogramData,
  Fingerprint,
} from "@/audio/types";
import { WasmModuleWrapper } from "@/loaders/WASMLoader";
import FingerprintModule from "@/wasm-types/fingerprint.types";
import * as AudioConstants from "@/audio/constants";

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
  // Allocate and setup the options struct in the wasm module's address space
  const m_optionsPtr = fingerprintModule._create_fingerprint_options(
    options.partitionAmount,
    options.FFTSize,
    options.partitionAmount
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
  if (m_fingerprintPtr === 0)
    return null;

  // TODO: implement
  return null;
}

export const generateFingerprint: FingerprintGeneratorFunction = async (
  spectrogramData,
  optionsPartial
) => {
  let fingerprint: Fingerprint | null = null;

  try {
    await wasmModule.loaderPromise;

    console.log(wasmModule.module); // TODO: remove

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

    // TODO: remove
    console.log(
      "Running fingerprint generation with...",
      spectrogramData,
      optionsPartial
    );

    // Run fingerprint generation
    const m_fingerprintPtr = fingerprintModule._generate_fingerprint(
      argData.m_specDataPtr,
      argData.m_optionsPtr
    );

    // TODO: remove
    console.log(
      "Fingerprint generation complete. Fingerprint pointer:",
      m_fingerprintPtr
    );
    console.log("Arg data", argData); // TODO: remove

    fingerprint = convertFingerprintResults(
      fingerprintModule,
      m_fingerprintPtr
    );

    // Free up module resources
    if (argData.m_optionsPtr !== 0)
      fingerprintModule._free(argData.m_optionsPtr);
    if (argData.m_dataPtr !== 0)
      fingerprintModule._free(argData.m_dataPtr);
    if (argData.m_specDataPtr !== 0)
      fingerprintModule._free(argData.m_specDataPtr);
    if (m_fingerprintPtr !== 0)
      fingerprintModule._free(m_fingerprintPtr);

    // wasmModule.module._temp(); // TODO: remove
  } catch (err) {
    console.log("Failed to load fingerprint generator wasm module");
  }

  if (fingerprint == null) {
    throw "Unable to generate fingerprint.";
  }

  return fingerprint;

  // TODO: remove
  // return {
  //   numberOfWindows: 0,
  //   numberOfPartitions: 0,
  //   data: new Uint8Array(0),
  //   partitionRanges: [],
  // };
};
