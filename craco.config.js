const CracoWorkboxPlugin = require("craco-workbox");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: CracoWorkboxPlugin,
    },
  ],
};
