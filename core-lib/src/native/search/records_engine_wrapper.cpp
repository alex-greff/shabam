#include "records_engine_wrapper.hpp"
#include <iostream>

Napi::Value
RecordsEngineWrapper::EncodeAddress(const Napi::CallbackInfo &info) {
  // Input parameters:
  // - anchorFrequency: uint16_t (number)
  // - pointFrequency: uint16_t (number)
  // - delta: uint32_t (number)
  // Returns: uint64_t (bigint)

  Napi::Env env = info.Env();

  if (info.Length() != 3) {
    Napi::TypeError::New(env, "3 arguments expected.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env,
                         "anchorFrequency argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "pointFrequency argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[2].IsNumber()) {
    Napi::TypeError::New(env, "delta argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  uint32_t anchor_frequency_32bit = info[0].As<Napi::Number>().Uint32Value();
  uint32_t point_frequency_32bit = info[1].As<Napi::Number>().Uint32Value();
  uint32_t delta = info[2].As<Napi::Number>().Uint32Value();

  if (anchor_frequency_32bit > UINT16_MAX) {
    Napi::TypeError::New(env, "anchorFrequency is too big.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (point_frequency_32bit > UINT16_MAX) {
    Napi::TypeError::New(env, "pointFrequency is too big.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  uint16_t anchor_frequency = (uint16_t)anchor_frequency_32bit;
  uint16_t point_frequency = (uint16_t)point_frequency_32bit;

  uint64_t address =
      RecordsEngine::EncodeAddress(anchor_frequency, point_frequency, delta);

  return Napi::BigInt::New(env, address);
}

Napi::Value
RecordsEngineWrapper::DecodeAddress(const Napi::CallbackInfo &info) {
  // Input parameters:
  // - address: uint64_t (bigint)
  // Returns: tuple of
  // - anchorFrequency: uint16_t (number)
  // - pointFrequency: uint16_t (number)
  // - delta: uint32_t (number)

  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "1 argument expected.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[0].IsBigInt()) {
    Napi::TypeError::New(env, "address argument needs to be a bigint.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  bool lossless;
  uint64_t address = info[0].As<Napi::BigInt>().Uint64Value(&lossless);

  if (!lossless) {
    std::cout << "Warning: address argument uint64_t decoding is not lossless."
              << std::endl;
  }

  uint16_t anchor_frequency, point_frequency;
  uint32_t delta;
  std::tie(anchor_frequency, point_frequency, delta) =
      RecordsEngine::DecodeAddress(address);

  Napi::Array ret = Napi::Array::New(env, 3);
  ret[(uint32_t)0] = Napi::Number::New(env, anchor_frequency);
  ret[1] = Napi::Number::New(env, point_frequency);
  ret[2] = Napi::Number::New(env, delta);

  return ret;
}

Napi::Value RecordsEngineWrapper::EncodeCouple(const Napi::CallbackInfo &info) {
  // Input parameters:
  // - absoluteTime: uint32_t (number)
  // - trackId: uint32_t (number)
  // Returns: uint64_t (bigint)

  Napi::Env env = info.Env();

  if (info.Length() != 2) {
    Napi::TypeError::New(env, "2 arguments expected.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env, "absoluteTime argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "trackId argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  uint32_t absolute_time = info[0].As<Napi::Number>().Uint32Value();
  uint32_t track_id = info[1].As<Napi::Number>().Uint32Value();

  uint64_t couple = RecordsEngine::EncodeCouple(absolute_time, track_id);

  return Napi::BigInt::New(env, couple);
}

Napi::Value RecordsEngineWrapper::DecodeCouple(const Napi::CallbackInfo &info) {
  // Input parameters:
  // - couple: uint64_t (bigint)
  // Returns: tuple of
  // - absoluteTime: uint32_t (number)
  // - trackId: uint32_t (number)

  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "1 argument expected.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (!info[0].IsBigInt()) {
    Napi::TypeError::New(env, "couple argument needs to be a bigint.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  bool lossless;
  uint64_t couple = info[0].As<Napi::BigInt>().Uint64Value(&lossless);

  if (!lossless) {
    std::cout << "Warning: couple argument uint64_t decoding is not lossless."
              << std::endl;
  }

  uint32_t absolute_time, track_id;
  std::tie(absolute_time, track_id) = RecordsEngine::DecodeCouple(couple);

  Napi::Array ret = Napi::Array::New(env, 2);
  ret[(uint32_t)0] = Napi::Number::New(env, absolute_time);
  ret[1] = Napi::Number::New(env, track_id);

  return ret;
}