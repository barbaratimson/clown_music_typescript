import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss'
import Main from "./components/Main";
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter, Router} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
        <BrowserRouter>
    <Provider store={store}>
     {/*<React.StrictMode>*/}
        <Main/>
      {/*</React.StrictMode>*/}
    </Provider>
        </BrowserRouter>
);

