// claude
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });

// //deepseek
// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname, {
//   // Enable CSS support
//   isCSSEnabled: true,
// });

// module.exports = withNativeWind(config, {
//   input: "./global.css",
//   // Add this for NativeWind v4+
//   projectRoot: __dirname,
// });