const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Bundle 3D models (e.g. assets/models/panda.glb) as assets.
config.resolver.assetExts.push('glb');

// three 0.186's CommonJS entry (three.cjs) calls Node's process.emitWarning,
// which React Native doesn't have. Resolve 'three' to its ES module build instead.
const threeModulePath = path.join(__dirname, 'node_modules/three/build/three.module.js');
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) =>
  moduleName === 'three'
    ? { type: 'sourceFile', filePath: threeModulePath }
    : (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);

module.exports = withNativeWind(config, { input: './global.css' });
