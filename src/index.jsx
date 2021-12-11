import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
//import App from './component/App.jsx';
//import App from 'component/App'; //使用alias
import App from 'App'; //使用resolve.modules


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};
render(App);

if (module.hot) {
  module.hot.accept('./component/App.jsx', () => {
    render(App);
  });
}
//ReactDOM.render(<App />, document.getElementById('root'));
