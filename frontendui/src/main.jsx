import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "./shared/context/AuthContext";
import { ThemeProvider } from "./shared/context/ThemeContext";
import client from "./services/apolloClient";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </ApolloProvider>,
);
