import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ProSidebarProvider } from "react-pro-sidebar";

import App from "./AppD";

import { ToastContainer } from "react-toastify";
import { toast_container_props } from "utils/config/toast-container/toast-config";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "scss/main.scss";

import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer {...toast_container_props} />
    <BrowserRouter>
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
    </BrowserRouter>
  </Provider>
);
