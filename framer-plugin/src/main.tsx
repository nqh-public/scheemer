/**
 * @what Entry point for Framer plugin React application
 * @why Initializes React DOM and mounts App component to root element
 * @props None - entry point script
 * @date 2025-10-30
 */

import "./index.css"
import "framer-plugin/framer.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./app"

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
