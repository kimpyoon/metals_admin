module.exports = {
  productionSourceMap: false,
  css: {
    sourceMap: false
  },
  devServer: {
      proxy: {
          '/api': {
              target: 'http://120.76.96.109:8080',
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/api': ''
              }
          }
      }
  }
}
