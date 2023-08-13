import React from 'react';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from './store';

import 'react-toastify/dist/ReactToastify.css';
import { TenantProvider } from './context/TenantContext';
import { PersistGate } from 'redux-persist/integration/react';
import Modal from 'react-modal';
import { GraphQlProvider } from './components/core/providers/GraphqlProvider';

const root = createRoot(document.getElementById('root') as HTMLElement);
Modal.setAppElement('#root');

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GraphQlProvider>
          <BrowserRouter>
            <TenantProvider>
              <App />
            </TenantProvider>
          </BrowserRouter>
        </GraphQlProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
