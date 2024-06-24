module.exports = {
  
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }],["@babel/plugin-proposal-class-properties", { "loose": true }],["@babel/plugin-transform-flow-strip-types"]],
  env: {
    test: {
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }],["@babel/plugin-proposal-class-properties", { "loose": true }]],
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      // ignore: [/node_modules/],
    },
  },
};
