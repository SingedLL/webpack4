const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
//拆分css样式的插件 缺点：不支持热更新， 所以只在生产环境中使用
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//压缩CSS文件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  entry: {
    index: './src/index.jsx',
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js', //未列在entry中，却又需要被打包出来的文件的名称 一般来说，这个chunk文件指的就是要懒加载的代码。
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          //如果css代码都写到index.html的<style>标签中，样式代码多了以后就会很不方便
          //可以利用插件将样式打包到单独的css文件中
          //webpack4使用mini-css-extract-plugin插件 而webpack4之前使用extract-text-webpack-plugin插件
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
        ],
      },

    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
    }),
  ],
  optimization: {
    //配置Tree Shaking，Tree Shaking只支持ES Module
    //像 import './app.styl'这样的导出， tree shaking则认为没有导出任何东西， 解析时就会忽略掉这个样式文件
    //所以需要在package.json中需要配置sideEffects， 告诉webpack哪些是不要使用tree shaking
    usedExports: true, //只对使用的模块打包

    //对CSS文件进行压缩
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
};

module.exports = merge(baseConfig, prodConfig);
