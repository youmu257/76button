module.exports = {
  publicPath: '',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new (require('webpack').DefinePlugin)({
        // 設定版本號
        'process.env.VUE_APP_VERSION': JSON.stringify(process.env.VUE_APP_VERSION),
      }),
    ],
  },
}