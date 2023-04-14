import React from "react";
import ReactDOM from "react-dom/client";
import { Footer } from "./Footer";
import { App } from "./App";

import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
        <Footer />
    </React.StrictMode>
);
