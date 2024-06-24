module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["@babel/plugin-transform-flow-strip-types"],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
};
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     [
//       require('@babel/plugin-proposal-decorators').default,
//       {
//         legacy: true,
//       },
//     ],
//     ['@babel/plugin-proposal-class-properties', { loose: true }],
//   ],
// };
