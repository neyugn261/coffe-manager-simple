import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Order from "./pages/Order/Order";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/menu",
        element: <Menu />,
    },
    {
        path: "/order",
        element: <Order />,
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
