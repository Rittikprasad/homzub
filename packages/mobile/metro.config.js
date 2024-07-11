const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const rootPath = path.resolve(__dirname, "../.."); // Adjust based on your actual root path

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    inlineRequires: true,
  },
  resolver: {
    unstable_enableSymlinks: true,
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
    extraNodeModules: {
      "@homzhub/mobile": path.resolve(rootPath, "packages/mobile"),
      "@homzhub/common": path.resolve(rootPath, "packages/common"),
      "@homzhub/web": path.resolve(rootPath, "packages/web"),
    },
  },
  watchFolders: [
    path.resolve(rootPath, "node_modules"),
    path.resolve(rootPath, "packages/common"),
    path.resolve(rootPath, "packages/mobile"),
    path.resolve(rootPath, "packages/web"),
    path.resolve(rootPath, "packages/ffm"),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
