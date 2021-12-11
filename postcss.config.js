//通过postcss中的autoprefixer可以实现将CSS3中的一些需要兼容写法的属性添加响应的前缀
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 0.15% in CN'], //必须设置支持的浏览器才会自动添加添加浏览器兼容 支持浏览器在中国份额大于0.15%
    }),
  ],
  /*plugins: {
    autoprefixer: {
      rootValue: 16, //你在html节点设的font-size大小
      unitPrecision: 5, //转rem精确到小数点多少位
      propList: ['font', 'font-size', 'line-height', 'letter-spacing'], //指定转换成rem的属性，支持 * ！
      selectorBlackList: [], // str/reg 指定不转换的选择器，str时包含字段即匹配
      replace: true,
      mediaQuery: false, //媒体查询内的px是否转换
      minPixelValue: 0, //小于指定数值的px不转换
    },
  },*/
};
