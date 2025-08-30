import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import "./main.css"
import StartPage from "./start-page/start-page"
import App from "./app/app"

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
    //errorElement: <ErrorPage />,
  },
  {
    path: "/:page",
    element: <App />,
  },
])

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <RouterProvider router={router} />
  //</StrictMode>
)
