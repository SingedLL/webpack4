const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//不使用DllPlugin， 每次打包的时候都要从node_modules中取出第三方模块，然后再将这些第三方模块打包到源代码中
//在这个过程中会消耗一些打包时间

//引入DllPlugin: 打包完第三方依赖后，去打包业务代码，这个时候就需要让业务代码知道不要再去打包哪些第三方模块了
//直接从打包好的vendor.js里面去取就可以了。

//引入DllPlugin动态链接库方案，将第三方库单独打包，再链入我们的webpack项目中， 提高打包性能
//webpack.dll.js文件目的：
//1.分离依赖包（第三方模块只打包一次）
//2.生成manifest.json映射文件，供DLLReferencePlugin映射到相关的依赖上去的。

module.exports = {
  mode: 'production',
  entry: {
    //要打包模块的数组
    //vendor: ['react', 'react-dom', 'lodash'],
    vendor: ['lodash'],
    react: ['react', 'react-dom'],
  },
  output: {
    path: path.resolve(__dirname, '../dll'), //放在项目的dll目录下面
    filename: '[name].dll.js', //生成的文件名称(默认为dll.vendor.[hash].js)
    library: '[name]', //以一个库的形式导出 需要与webpack.DllPlugin中的name保持一致
  },
  plugins: [
    new CleanWebpackPlugin(),
    //webpack.DllPlugin将项目依赖的第三方模块抽离出来，然后打包到一个个单独的动态链接库中。
    //当下一次打包时， 通过webpackReferencePlugin，如果打包过程中发现需要导入的模块存在于某个动态链接库中
    //就不再次被打包，而是去动态链接库中get到
    //webpack.DllPlugin,对库文件进行分析，生成映射文件
    new webpack.DllPlugin({
      name: '[name]', //与output.library保持一致
      //将库里边一些第三方模块的映射关系放到 [name].manifest.json的文件下
      path: path.resolve(__dirname, '../dll/[name].manifest.json'),
    }),
  ],
};
