// Aggregation layer to make imports easier by not having to import the
// core_lib_native.node module every time (there's no intellisense to make
// sure your path to it us actually correct)
import CoreLibNative from "../../build/Release/core_lib_native.node";

export default CoreLibNative;