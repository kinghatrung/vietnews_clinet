import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { Provider } from 'react-redux';
import { store, persistor } from '~/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import('bootstrap/dist/js/bootstrap.bundle.min.js');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </React.StrictMode>
        </PersistGate>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
