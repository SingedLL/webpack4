import React, { Component } from 'react';

//import logo from '../images/logo.png';
import logo from 'images/logo.png'; //使用alias
import appStyle from '../style/app.styl';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      text: 'Hello World',
      prefetchContent: null,
    });
  }

  changeText = () => {
    this.setState({
      text: 'Webpack',
    });
  }

  clickHandle = () => {
    // /* webpackChunkName: "math"*/ 魔法注释， 打包出来的chunk名称, 对应的是output.chunkFilename
    // /* webpackPrefetch: true*/ /* webpackPreload: true*/
    import(/* webpackPreload: true*//* webpackChunkName: "math"*/ '../utils/math').then(({ add, mins }) => {
      const num = add(1, 2) + mins(2, 1);
      return num;
    })
      .then((num) => {
        this.setState({
          prefetchContent: num,
        });
      });
  }

  render() {
    const { text, prefetchContent } = this.state;
    return (
      <div className="container">
        <label className={appStyle.title}>App Module</label>
        {/*shimming的使用*/}
        <label className={appStyle.title}>{_.join(['shimming', 'tests'], '')}</label>
        <img src={logo} className={appStyle.logo} alt="logo" />
        {/*test HMR*/}
        <label className={appStyle.text} onClick={this.changeText}>{ text}</label>
        {/*Async load 懒加载/按需加载/异步加载 在需要的时候才去加载math模块*/}
        <button className={appStyle.button} onClick={this.clickHandle}>异步加载</button>
        <label className={appStyle.text}>{prefetchContent}</label>
      </div>
    );
  }
}

export default App;
