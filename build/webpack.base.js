const path = require('path');
const webpack = require('webpack');
//fs模块用于对系统文件及目录进行读写操作
const fs = require('fs');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
//在html-webpack-plugin基础上再增加静态资源
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const plugins = [
  //每次打包前先清除输出目录
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html', //模版文件
    //chunks: ['vendor', 'index', 'utils']  //引入需要的chunk
    /*minify: {
        collapseWhitespace: true, //移除空格
        removeComments: true, //移除注释
        removeAttributeQuotes: true, //移除双引号
    }*/
  }),
  //Shimming
  new webpack.ProvidePlugin({
    _: 'lodash', //当某个模块里用到_， 则会自动在模块中引用lodash库
  }),
];

//webpack在打包业务代码的时候，会通过这个插件参考是否有已经打包在vendor中的模块。
//如果存在就不会将代码打包进去而是通过一个统一的name(这个name在这里就是下面的name)来引入模块。
const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
files.forEach((file) => {
  if (/.*\.dll.js/.test(file)) {
    //引用***.dll.js到生成的index.html中
    plugins.push(new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll', file), //要添加到编译中的文件的绝对路径
    }));
  }
  if (/.*\.manifest.json/.test(file)) {
    plugins.push(new webpack.DllReferencePlugin({ //告诉webpack使用动态链接库
      manifest: path.resolve(__dirname, '../dll', file), //描述动态链接库的文件内容
    }));
  }
});

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  //配置webpack寻找模块的规则
  resolve: {
    //配置webpack去哪些目录下寻找第三方模块，默认只会去node_modules目录下寻找
    modules: [
      './src/component',
      'node_modules',
    ],
    //帮助webpack解析扩展名, 引入js和jsx文件，可以不写他们的扩展名
    //为了打包性能，不要配置太多， 只配置逻辑文件的后缀， 资源文件等不要配置
    extensions: ['.js', '.jsx'], //默认值是['.js', '.json']
    //模块别名配置, 用于映射模块 精简代码书写时相对路径的书写
    alias: {
      src: path.resolve(__dirname, '../src'),
      component: path.resolve(__dirname, '../src/component'),
      images: path.resolve(__dirname, '../src/images'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env', //用于解析ES6语法
                  {
                    corejs: 3, //指定core-js的版本
                    useBuiltIns: 'usage',
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-transform-react-jsx',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                'react-hot-loader/babel', //React需要使用这个loader才可以实现HMR
              ],
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true, //对于简单的错误，自动修复
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
              limit: 1024 * 2,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins,
  optimization: {
    //Code Splitting
    //假如index.js 2MB 打包文件很大， 加载时间会很长
    //将index.js拆分成lodash.js（1MB）, main.js (1MB)
    //此时修改了main.js中的内容， 只要重新加载main.js
    //webpack4中用splitChunks替代了CommonsChunkPlugin
    splitChunks: {
      chunks: 'all',               //async:(默认)仅对异步代码进行代码分割    initial:仅对入口文件进行代码分割
      minSize: 30000,              //引入的模块大于30Kb才会进行代码分割
      minChunks: 1,                //当一个模块至少被引用了一次，才会对它进行代码分割
      maxAsyncRequests: 5,         //最大异步请求chunks, 当超过5个js文件，则剩下的不会再进行代码分割
      maxInitialRequests: 3,       //最大初始化chunks (入口文件引入的模块，最多只能分割3个js文件)
      automaticNameDelimiter: '~', //文件名的连接符号
      name: true,                  //拆分出来文件的名称，默认为true,表示自动生成文件名，如果设置为固定的字符串则所有的chunk都会被合并成一个
      cacheGroups: {               //设置缓存组用来抽取满足不同规则的chunk
        vendors: {
          //代码中引入的库在node_modules下， 则打包到vendors.js文件中
          test: /[\\/]node_modules[\\/]/,
          priority: -10,                  //如果有一个模块满足多个缓存组的条件就会按照权重划分，谁的权重高就优先按照谁的规则处理
          filename: 'vendors.js',
        },
        default: {
          priority: -20,
          //如果某个模块已经被打包了， 则直接使用之前打包的模块，不会再次打包
          reuseExistingChunk: true,
          filename: 'common.js',
        },
      },
    },

  },
};
