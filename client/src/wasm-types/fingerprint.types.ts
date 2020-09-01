import { BaseWasmModule, pointer } from "@/wasm-types/base/base-wasm-types";

export default interface FingerprintModule extends BaseWasmModule {
  _create_spectrogram_data(
    num_windows: number,
    freq_bin_count: number,
    data_ptr: pointer
  ): pointer;

  _create_fingerprint_options(
    partition_amount: number,
    partition_ranges_ptr: pointer,
    num_partition_ranges: number
  ): pointer;

  _initialize_global_fingerprint_options(
    partition_amount: number,
    partition_curve: number,
    slider_width: number,
    slider_height: number,
    std_dev_mult: number
  ): void;

  _global_fingerprint_options_initialized(): boolean;

  _generate_fingerprint(
    spectrogram_data_ptr: pointer,
    options_ptr: pointer
  ): pointer;

  _free_spectrogram_data(spectrogram_data_ptr: pointer): void;
  _free_fingerprint_options(options_ptr: pointer): void;
  _free_fingerprint(fingerprint_ptr: pointer): void;
}
