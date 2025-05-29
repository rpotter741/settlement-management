import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';
import { SnackbarProvider } from './context/SnackbarContext';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from './app/store.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </DndProvider>
    </Provider>
  );
} else {
  throw new Error("Root element with id 'root' not found");
}
