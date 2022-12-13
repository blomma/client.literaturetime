import React from "react";
import ReactDOM from "react-dom/client";
import { Footer } from "./Footer";
import { App } from "./App";
import { createGlobalStyle } from "styled-components";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const GlobalStyle = createGlobalStyle`
    body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: dimgrey;
        font-family: "Merriweather", Times, serif;
    }
`;

root.render(
    <React.StrictMode>
        <GlobalStyle />
        <App />
        <Footer />
    </React.StrictMode>
);
