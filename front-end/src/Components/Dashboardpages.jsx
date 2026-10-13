import React from 'react'
import PatientDashboard from '../Pages/Dashboard/Patient/PatientDashboard';
import DoctorDashboard from '../Pages/Dashboard/Doctor/Doctordashboard';
import OverviewPage from '../Pages/Dashboard/Admin/Overviewpage';
import useAuth from '../hooks/useAuth';
import { LogIn, UserX } from 'lucide-react';
import { Link } from 'react-router';

const Dashboardpages = () => {

    const { user, loading } = useAuth();



    if (loading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl bg-white shadow-sm shadow-slate-900/5">
                <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-slate-500">Loading your dashboard…</p>
            </div>
        );
    }

    // 2. Unauthenticated state
    if (!user) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 text-center shadow-sm shadow-slate-900/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <UserX className="h-6 w-6" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-slate-800">You're not signed in</p>
                    <p className="mt-1 text-xs text-slate-400">Sign in to view your dashboard.</p>
                </div>
                <Link
                    to="/auth/login"
                    className="mt-1 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <LogIn className="h-4 w-4" />
                    Sign In
                </Link>
            </div>
        );
    }

    // 3. Role-based conditional rendering (case-insensitive)
    const role = user?.role?.toLowerCase();

    if (role === "patient") {
        return <PatientDashboard />;
    }

    if (role === "doctor") {
        return <DoctorDashboard />;
    }

    if (role === "admin") {
        return <OverviewPage />;
    }

    return (
        <div>Dashboardpages</div>
    )
}

export default Dashboardpages