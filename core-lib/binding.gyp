{
  "targets": [
    {
      "target_name": "core_lib_native",
      # "cflags!": [ "-fno-exceptions", "-fpermissive" ],
      # "cflags_cc!": [ "-fno-exceptions", "-fpermissive" ],
      "cflags": [ "-fno-exceptions", "-fexceptions", "-fpermissive" ],
      "cflags_cc": [ "-fno-exceptions", "-fexceptions", "-fpermissive" ],
      "sources": [
        "./src/native/greeting.cpp",
        "./src/native/spectrogram/spectrogram.cpp",
        "./src/native/spectrogram/spectrogram_wrapper.cpp",
        "./src/native/fingerprint/fingerprint.cpp",
        "./src/native/fingerprint/fingerprint_wrapper.cpp",
        "./src/native/search/records_table.cpp",
        "./src/native/search/records_table_wrapper.cpp",
        "./src/native/search/records_engine.cpp",
        "./src/native/search/records_engine_wrapper.cpp",
        "./src/native/search/memory_records_engine.cpp",
        "./src/native/search/memory_records_engine_wrapper.cpp",
        "./src/native/temp/cc_inheritance.cpp",
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