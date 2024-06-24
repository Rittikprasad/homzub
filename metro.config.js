const path = require('path');
const getWorkspaces = require('get-yarn-workspaces');
const { getDefaultConfig } = require('metro-config');

async function getConfig(appDir) {
  const workspaces = getWorkspaces(appDir);

  const watchFolders = [
    path.resolve(appDir, 'node_modules'),
    ...workspaces.filter((workPath) => !workPath.match(/node_modules/)),
  ];

  const defaultConfig = await getDefaultConfig();

  return {
    watchFolders,
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
      nodeModulesPaths: watchFolders,
      disableHierarchicalLookup: false,
    },
    resetCache: true,
  };
}

module.exports = (async () => await getConfig(__dirname))();
