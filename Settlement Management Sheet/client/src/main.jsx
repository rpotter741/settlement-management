import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { DragProvider } from './context/DragContext.jsx';
import { SnackbarProvider } from './context/SnackbarContext';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from './app/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <DragProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </DragProvider>
    </DndProvider>
  </Provider>
);
