const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Production build için gerekli ayarlar
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

// Hermes için optimizasyonlar
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_keys: true,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  warnings: false,
};

module.exports = config; 