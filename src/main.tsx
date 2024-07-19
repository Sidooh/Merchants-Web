import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store.ts';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';

import '@/assets/css/index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ThemeProvider defaultTheme={'light'} storageKey={'sidooh-ui-theme'}>
                    <App />
                    <Toaster richColors />
                </ThemeProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
