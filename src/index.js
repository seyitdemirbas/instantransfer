import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import reportWebVitals from './reportWebVitals';
import { store } from './store/store';
import { Provider } from 'react-redux'
import AppRouter from './routers/AppRouter';
import { HelmetProvider } from 'react-helmet-async';
import './parse/parseConf'

// store.subscribe(()=> {
//   console.log(store.getState())
// })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider store={store}>
      <HelmetProvider>
        <AppRouter />
      </HelmetProvider>
    </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
