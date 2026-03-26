import React from "react";
import ReactDOM from "react-dom/client";
import "modern-normalize";

import App from "./App.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import "./styles.css";
import "./css/Base.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <UIProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UIProvider>
    </Provider>
  </React.StrictMode>,
);
