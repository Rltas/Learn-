var path = require('path')
var utils = require('./utils')

var webpack = require('webpack')

var projectRoot = path.resolve(__dirname, '../')
const vuxLoader = require('vux-loader')

var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: '/'
    // publicPath: '$!webPath/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      '@': resolve('src'),
      'base': resolve('src/base'),
      'common': resolve('src/common'),
      'api': resolve('src/api'),
      'js': resolve('src/js'),
      'components': resolve('src/components'),
    }
  },
  module: {
    rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test')]
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }
    ]
  },
   plugins: [
      new webpack.optimize.CommonsChunkPlugin('common.js'),
      new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
    ]
}


module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    {
      name: 'vux-ui'
    },
    {
      name: 'duplicate-style'
    },
    {
      name: 'less-theme',
      path: 'src/theme.less'
    }
  ]
})
