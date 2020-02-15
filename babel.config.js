module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  var presets = [['@babel/preset-env']]

  if (api.env(["development", "test"])) {
      presets[0][1] = {
        targets: {
          node: "current"
        }
      }
  }

  return {
    presets
  }
}
