import React from "react";

import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import MedicalServicesPage from "../Pages/Home/MedicalServicesPage";
import Aboutpage from "../Pages/Home/Aboutpage";
import Contactpage from "../Pages/Home/Contactpage";
import Errorpage from "../Pages/Errorpage/Errorpage";
import Doctorspage from "../Pages/Home/Doctorspage";
import SignIn from "../Pages/Auth/SignIn";
import AuthLayout from "../Layout/AuthLayout";
import Register from "../Pages/Auth/Register";
import Forgotpasswordpage from "../Pages/Auth/Forgotpasswordpage";
import VerifyEmail from "../Pages/Auth/VerifyEmail";
import ResetPassword from "../Pages/Auth/ResetPassword";
import DoctorProfilePage from "../Pages/Home/Doctorprofilepage";

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
            },
            {
                path: '/doctors/:doctorId',
                Component: DoctorProfilePage
            }
        ]

    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [

            {
                path: 'login',
                Component: SignIn
            },
            {
                path: 'register',
                Component: Register
            }
        ]

    },
    {
        path: 'forgot-password',
        Component: Forgotpasswordpage
    },
    {
        path: 'reset-password',
        Component: ResetPassword
    },
    {
        path: 'verify-email',
        Component: VerifyEmail
    },
    {
        path: '*',
        Component: Errorpage
    }

]);

export default router;