import React from "react";

import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import MedicalServicesPage from "../Pages/Home/MedicalServicesPage";
import Aboutpage from "../Pages/Home/Aboutpage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'services',
                Component: MedicalServicesPage
            },
            {
                path: 'about',
                Component: Aboutpage
            }
        ]

    }
]);

export default router;