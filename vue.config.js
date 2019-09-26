// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/short-url/'
    : '/',
  
  // webpack
  configureWebpack: {
    externals: {
      // 'vue': 'Vue',
    }
  }
}