module.exports = {
  GenerateSW: (options) => {
    return options;
  },
  InjectManifest: (options) => {
    options.exclude = [
      /\.map$/,
      /asset-manifest\.json$/,
      /LICENSE/,
      /index.html/,
    ];
    return options;
  },
};
