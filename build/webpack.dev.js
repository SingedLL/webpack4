const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  entry: {
    index: [
      'react-hot-loader/patch',
      './src/index.jsx', //入口文件
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    port: 9000,
    open: true,
    hot: true,
    overlay: true,
    //hotOnly: true,
    //historyApiFallback: true,  等价于下面配置
    historyApiFallback: {
      rewrites: [{
        from: /\.*/,
        to: '/index.html',
      }],
    },
    proxy: {                   // 跨域代理转发
      //'/react/api': 'http://www.lemon.com'
      '/react/api': {
        target: 'http://www.lemon.com', //如果访问/react/api这个路径， devService会自动的转发到http://localhost:3000
        secure: false, //
        pathRewrite: {
          //'header.json': 'demo.json' //demo.json临时接口 header.json线上接口
        },
        changeOrigin: true,
        headers: {
          host: 'www.lemon.com',
        },
      },
    },
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
            },
          },
          'stylus-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true, //样式文件模块化的目的： 局部组件引入局部css样式,实现css模块化开发; 减免全局污染
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(baseConfig, devConfig);
