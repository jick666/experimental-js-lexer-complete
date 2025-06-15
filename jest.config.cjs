module.exports = {
  testEnvironment: 'node',
  // Tell Jest to treat .js files as ESM
  extensionsToTreatAsEsm: ['.js'],
  // Don’t transform, we’re native ESM
  transform: {},
};
