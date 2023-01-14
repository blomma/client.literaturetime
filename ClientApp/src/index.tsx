import React from "react";
import ReactDOM from "react-dom/client";
import { Footer } from "./Footer";
import { App } from "./App";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, LightTheme } from "./Theme";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={LightTheme}>
            <GlobalStyle />
            <App />
            <Footer />
        </ThemeProvider>
    </React.StrictMode>
);
