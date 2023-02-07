{
  "targets": [
    {
      "target_name": "core_lib_native",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [
        "./src/native/greeting.cpp",
        "./src/native/spectrogram/spectrogram.cpp",
        "./src/native/spectrogram/spectrogram_wrapper.cpp",
        "./src/native/fingerprint/fingerprint.cpp",
        "./src/native/fingerprint/fingerprint_wrapper.cpp",
        "./src/native/search/records_table.cpp",
        "./src/native/search/records_table_wrapper.cpp",
        "./src/native/search/records_engine.cpp",
        "./src/native/search/memory_records_engine.cpp",
        "./src/index.cpp"
      ],
      "libraries": [
        "/usr/local/lib/libliquid.a"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}