import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './utils/stripe.utils';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/organizer', element: <p className="text-white">ORGANIZER</p> },
  { path: '*', element: <p>ERROR</p> },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Elements>
  </React.StrictMode>,
);
