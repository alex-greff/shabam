export type pointer = number;

export interface BaseWasmModule {
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;

  _malloc(size: number): number;
  _free(ptr: number): void;
  _memcpy(dest: number, src: number, size: number): number;
  _memmove(src1: number, src2: number, size: number): number;
  _memset(str: number, c: number, size: number): number;
}