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
import DashboardLayout from "../Layout/DashboardLayout";
import User from "../Pages/Dashboard/Patient/user";
import PatientDashboard from "../Pages/Dashboard/Patient/PatientDashboard";
import Appointments from "../Pages/Dashboard/Patient/Appointments";
import BookAppointment from "../Pages/Dashboard/Patient/BookAppointment";
import MyDoctors from "../Pages/Dashboard/Patient/MyDoctors";
import MedicalRecordsPage from "../Pages/Dashboard/Patient/Medicalrecordspage";
import ProfileSettingsPage from "../Pages/Dashboard/Patient/Profilesettingspage";
import NotificationsPage from "../Components/Notificationspage";
import DoctorDashboard from "../Pages/Dashboard/Doctor/Doctordashboard";
import AppointmentsPage from "../Pages/Dashboard/Doctor/Appointmentspage";
import PatientsPage from "../Pages/Dashboard/Doctor/Patientspage";
import MessagesPage from "../Pages/Dashboard/Doctor/Messagespage";
import DoctorProfilesettingspag from "../Pages/Dashboard/Doctor/DoctorProfilesettingspag";
import DoctorsManagement from "../Pages/Dashboard/Admin/DoctorsManagement";
import OverviewPage from "../Pages/Dashboard/Admin/Overviewpage";
import Dashboardpages from "../Components/Dashboardpages";
import PatientsManagementPage from "../Pages/Dashboard/Admin/Patientsmanagementpage";
import AppointmentsManagementPage from "../Pages/Dashboard/Admin/Appointmentsmanagementpage";
import DepartmentsPage from "../Pages/Dashboard/Admin/Departmentspage";
import PaymentsRevenue from "../Pages/Dashboard/Admin/Paymentsrevenue";
import ReviewsPage from "../Pages/Dashboard/Admin/Reviewspage";
import AddDoctor from "../Pages/Dashboard/Admin/Adddoctor";
import UpdatePassword from "../Pages/Auth/UpdatePassword";
import { BookingCancelledPage, BookingFailedPage, BookingSuccessPage } from "../Pages/Home/Bookingstatuspages";
import AddMedicalRecord from "../Pages/Dashboard/Doctor/Addmedicalrecord";
import AdminMessagesPage from "../Pages/Dashboard/Admin/Adminmessagespage";
import AdminNotificationsPage from "../Pages/Dashboard/Admin/Adminnotificationspage";
import PrivateRoute from "../routes/PrivateRoute";

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
            },
            {
                path: 'booking/success',
                element:<PrivateRoute><BookingSuccessPage /></PrivateRoute>
            },
            {
                path: 'booking/failed',
                element: <PrivateRoute><BookingFailedPage /></PrivateRoute>
            },
            {
                path: 'booking/cancelled',
                element: <PrivateRoute><BookingCancelledPage /></PrivateRoute>
            },
        ]

    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <Dashboardpages />
            },
            {
                path: 'my-appointments',
                element: <Appointments />
            },
            {
                path: 'book-appointment',
                element: <BookAppointment />
            },
            // {
            //     path: 'my-doctors',
            //     element: <MyDoctors />
            // },
            {
                path: 'patient-management',
                element: <PatientsManagementPage />
            },
            {
                path: 'appointment-management',
                element: <AppointmentsManagementPage />
            },
            {
                // path: 'department-management',
                // element: <DepartmentsPage />
            },
            {
                path: 'payments-revenue',
                element: <PaymentsRevenue />
            },
            // {
            //     path: 'reviews',
            //     element: <ReviewsPage />
            // },
            {
                path: 'adddoctor',
                element: <AddDoctor />
            },
            {
                path: 'add-medical-record',
                element: <AddMedicalRecord />
            },
            {
                path: 'medical-records',
                element: <MedicalRecordsPage />
            },
            // {
            //     path: 'settings',
            //     element: <ProfileSettingsPage />
            // },
            {
                path: 'notifications',
                element: <NotificationsPage />
            },
            {
                path: 'doctors-appointment',
                element: <AppointmentsPage />
            },
            {
                path: 'patients',
                element: <PatientsPage />
            },
            {
                path: 'messages',
                element: <MessagesPage />
            },
            {
                path: 'admin-messages',
                element: <AdminMessagesPage />
            },
            {
                path: 'admin-notificationspage',
                element: <AdminNotificationsPage />
            },
            // {
            //     path: 'doctor-profile',
            //     element: <DoctorProfilesettingspag />
            // },
            {
                path: 'doctor-management',
                element: <DoctorsManagement />
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
        path: 'set-password',
        Component: UpdatePassword
    },
    {
        path: '*',
        Component: Errorpage
    }

]);

export default router;