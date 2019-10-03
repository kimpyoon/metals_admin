module.exports = {
  productionSourceMap: false,
  css: {
    sourceMap: false
  },
  devServer: {
      proxy: {
          '/api': {
              target: 'http://47.101.197.101:8080',
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/api': ''
              }
          }
      }
  }
}
