// User.jsx
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import ProfileSettingsPage from './Profilesettingspage';
import DoctorDashboard from '../Doctor/Doctordashboard';
import PatientDashboard from './PatientDashboard';
import OverviewPage from '../Admin/Overviewpage';

const User = () => {
  // const { user, loading } = useAuth();

  const user = "patient"


  // 1. Loading state
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-slate-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // 2. Unauthenticated state
  if (!user) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-red-500 font-medium">No user logged in.</p>
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

  // 4. Fallback/default component (if the role does not match).
  return <PatientDashboard />;
};

export default User;