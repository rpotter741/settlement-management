import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';
import { SnackbarProvider } from './context/Snackbar/SnackbarContext.js';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from './app/store.js';
import { Global } from '@emotion/react';
import GlobalSnackbar from './features/Snackbar/GlobalSnackbar.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
        <GlobalSnackbar />
      </DndProvider>
    </Provider>
  );
} else {
  throw new Error("Root element with id 'root' not found");
}
