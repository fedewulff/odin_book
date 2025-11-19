import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./main.css";
import StartPage from "./pages/startPage/startPage";
import App from "./pages/private/app/app";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/:page",
    element: <App />,
  },
]);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
