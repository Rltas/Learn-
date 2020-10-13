const path = require('path');
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false, // 关闭eslint规范
  assetsDir: 'vue', //打包文件路径
  productionSourceMap: false, //不要Map打包文件
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('service', resolve('src/service'))
      .set('utils', resolve('src/utils'))
      .set('store', resolve('src/store'))
      .set('router', resolve('src/router'))
      .set('config', resolve('src/config'))
  },
  devServer: {
    port: 5656, //端口号
    https: false,
    open: true,
    proxy: {
      '/app/Index.htm': {
        target: 'http://cs.yujiaojiaoyu.com',
        changeOrigin: true,
        // ws: true,
        // pathRewrite: {
        //   '^/app': '/app'
        // }
        //反向代理  遇到/app/Index.htm,域名代理为target的地址
      },
      '/gkzy': {
        target: 'http://cs.yujiaojiaoyu.com',
        changeOrigin: true,
        ws: true
      },
      // '/app/user_info.htm': {
      //   target: 'http://cs.yujiaojiaoyu.com',
      //   changeOrigin: true,
      //   ws: true
      // }
    }
  },
  configureWebpack: {
    plugins: []
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/css/common.less')
      ],
    },
  }
}