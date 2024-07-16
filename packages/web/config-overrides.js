const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { override, babelInclude } = require('customize-cra');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// our packages that will now be included in the CRA build step
const appIncludes = override(
  babelInclude[
    (resolveApp('src'), resolveApp('../common/src'), resolveApp('../../node_modules/react-native-vector-icons'))
  ]
);

module.exports = function override(config, env) {
  // allow importing from outside of src folder
  config.resolve.plugins = config.resolve.plugins.filter((plugin) => plugin.constructor.name !== 'ModuleScopePlugin');
  config.module.rules[0].include = appIncludes;
  config.module.rules[1] = null;
  config.module.rules[2].oneOf[1].include = appIncludes;
  config.module.rules[2].oneOf[1].options.plugins = [
    require.resolve('babel-plugin-react-native-web'),
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-transform-modules-commonjs'),
    require.resolve('babel-plugin-inline-react-svg'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('react-native-reanimated/plugin'),
  ].concat(config.module.rules[2].oneOf[1].options.plugins);
  config.module.rules = config.module.rules.filter(Boolean);
  config.plugins.push(new webpack.DefinePlugin({ __DEV__: env !== 'production' }));

  return config;
};
