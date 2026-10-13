import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../Components/Sidebar";
import TopNavbar from "../Components/TopNavbar";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const DashboardLayout = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { user, logout, loading } = useAuth();
    
    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!",
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                Swal.fire("Logged out!", "", "success");
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fbfe]">

            <div className="flex min-h-screen">

                {/* Sidebar */}
                <Sidebar
                    handleLogout={handleLogout}
                    
                />

                {/* Main */}
                <div className="min-w-0 flex-1 bg-[#F7FBFF]">

                    {/* Navbar */}
                    <TopNavbar
                        user={user}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}

                    />

                    {/* Outlet */}
                    <main>
                        <Outlet />
                    </main>

                </div>

            </div>

        </div>
    );
};

export default DashboardLayout;