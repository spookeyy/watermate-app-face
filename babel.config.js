//claude
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};

// deepseek
// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       [
//         "babel-preset-expo",
//         {
//           jsxRuntime: "automatic",
//           jsxImportSource: "nativewind",
//         },
//       ],
//     ],
//     plugins: [
//       "nativewind/babel",
//       // Add react-native-reanimated plugin if using animations
//       "react-native-reanimated/plugin",
//     ],
//   };
// };