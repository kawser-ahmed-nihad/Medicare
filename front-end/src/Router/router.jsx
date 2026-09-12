import React from "react";

import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import MedicalServicesPage from "../Pages/Home/MedicalServicesPage";
import Aboutpage from "../Pages/Home/Aboutpage";
import Contactpage from "../Pages/Home/Contactpage";
import Errorpage from "../Pages/Errorpage/Errorpage";
import Doctorspage from "../Pages/Home/Doctorspage";

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
            },
            {
                path: 'contact',
                Component: Contactpage
            },
            {
                path: 'find-doctors',
                Component: Doctorspage
            }
        ]

    },
    {
        path:'*',
        Component: Errorpage
    }

]);

export default router;