import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { store } from './store/store';
import { Provider } from 'react-redux'
import AppRouter from './routers/AppRouter';
import { HelmetProvider } from 'react-helmet-async';
import './parse/parseConf'

store.subscribe(()=> {
  console.log(store.getState())
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider store={store}>
      <HelmetProvider>
        <AppRouter />
      </HelmetProvider>
    </Provider>

);

