// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/short-url/'
    : '/',
  // devServer
  devServer: {
    open: true,
    proxy: {
      '/weibo-api2': {
        target: 'https://api.weibo.com/2',
        changeOrigin: true,
        pathRewrite: {
            '^/weibo-api2': ''
        }
      }
    }
  },
  // webpack
  configureWebpack: {
    externals: {
      // 'vue': 'Vue',
    }
  }
}