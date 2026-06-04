import { createRoot } from "react-dom/client";
import App from "./app/App";
import { store } from "./app/app.store.js";
import { Provider } from "react-redux";
import "./config/http.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
