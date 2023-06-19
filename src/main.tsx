import React from "react";
import {ApolloProvider} from "@apollo/client";
import ReactDOM from "react-dom/client";

import client from "./services/apolloClient";

import App from "./containers/App/App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
