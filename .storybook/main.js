const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // "@"でimportする設定をstorybookにも適用
        "@": path.resolve(__dirname, "../src"),
        // emotionはchakraに必要
        "@emotion/core": path.resolve(
          __dirname,
          "../node_modules/@emotion/react"
        ),
        "emotion-theming": path.resolve(
          __dirname,
          "../node_modules/@emotion/react"
        ),
      },
    },
  }),
};
