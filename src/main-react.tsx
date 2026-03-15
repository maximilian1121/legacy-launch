import "./index.css"; // import css

import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Titlebar from "./components/Titlebar";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <Titlebar />
        <div className="p-2">
            <App />
        </div>
    </React.StrictMode>,
);
