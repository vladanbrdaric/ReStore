import { createBrowserHistory } from 'history';
import React from 'react';
// import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { StoreProvider } from './app/context/StoreContext';
import App from './app/layout/App';
import './app/layout/styles.css'
import { store } from './app/store/configureStore';
import reportWebVitals from './reportWebVitals';


// Using Redux


export const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
     {/** <StoreProvider>       this StoreProvider come from StoreContext which has been substitutet with Redux Toolkit*/} 
        {/** This provider comes form Redux and now App component will have access to store variable. */}
        <Provider store={store}>
          <App />
        </Provider>
{/** </StoreProvider> */}
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);


/* const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router history={history}>
      <App />
    </Router>
  </React.StrictMode>
); */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
