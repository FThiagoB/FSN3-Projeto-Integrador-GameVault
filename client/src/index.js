import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./contexts/CartContext";
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CookiesProvider>
  </React.StrictMode>
);
