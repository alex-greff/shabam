import { BaseWasmModule, pointer } from "@/wasm-types/base/base-wasm-types";

export default interface FingerprintModule extends BaseWasmModule {
  _create_spectrogram_data(
    num_windows: number,
    freq_bin_count: number,
    data_ptr: pointer
  ): pointer;

  _create_fingerprint_options(
    partition_amount: number,
    FFT_size: number,
    partition_curve: number
  ): pointer;

  _generate_fingerprint(
    spectrogram_data_ptr: pointer,
    options_ptr: pointer
  ): pointer;
}
