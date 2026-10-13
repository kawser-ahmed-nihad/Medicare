import React from "react";
import { useSearchParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
    Calendar,
    Clock,
    Wallet,
    Stethoscope,
    ArrowRight,
} from "lucide-react";

/*
  Three routes point here:
    /booking/success?appointmentId=...
    /booking/failed?appointmentId=...
    /booking/cancelled?appointmentId=...

  Each is a thin wrapper around <BookingStatusCard status="..." />, which
  fetches the appointment (GET /api/appointments/:id) to show real details.
*/

const STATUS_CONFIG = {
    success: {
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-500",
        title: "Appointment Confirmed",
        message: "Your appointment has been booked. A confirmation email is on its way.",
    },
    failed: {
        icon: XCircle,
        iconClass: "bg-rose-50 text-rose-500",
        title: "Payment Failed",
        message: "We couldn't complete your payment. Your appointment wasn't confirmed — you can try again.",
    },
    cancelled: {
        icon: AlertTriangle,
        iconClass: "bg-amber-50 text-amber-600",
        title: "Payment Cancelled",
        message: "You cancelled the payment. The appointment slot has been released.",
    },
};

function BookingStatusCard({ status }) {
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get("appointmentId");
    const axiosSecure = useAxiosSecure();
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    const { data, isLoading } = useQuery({
        queryKey: ["appointment", appointmentId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/appointments/${appointmentId}`);
            return res.data.appointment;
        },
        enabled: Boolean(appointmentId),
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8fbfe] px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm shadow-slate-900/5">
                <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${config.iconClass}`}>
                    <Icon size={32} />
                </span>
                <h1 className="mt-5 text-xl font-bold text-[#0A1931]">{config.title}</h1>
                <p className="mt-2 text-sm text-slate-500">{config.message}</p>

                {isLoading ? (
                    <div className="mt-6 flex justify-center">
                        <Loader2 size={20} className="animate-spin text-[#0066FE]" />
                    </div>
                ) : data ? (
                    <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-sm">
                        <p className="flex items-center gap-2 text-slate-600">
                            <Stethoscope size={14} className="text-[#0066FE]" />
                            {data.doctorName || "Doctor"}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className="text-[#0066FE]" />
                            {data.date}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600">
                            <Clock size={14} className="text-[#0066FE]" />
                            {data.time_slot}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600">
                            <Wallet size={14} className="text-[#0066FE]" />
                            ৳{data.consultation_fee} — {data.payment_status === "paid" ? "Paid online" : "Pay at hospital"}
                        </p>
                    </div>
                ) : null}

                <div className="mt-7 flex flex-col gap-2.5">
                    {status === "success" ? (
                        <Link to="/dashboard/my-appointments" className="flex items-center justify-center gap-2 rounded-xl bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                            View My Appointments <ArrowRight size={15} />
                        </Link>
                    ) : (
                        <Link
                            to={data?.doctorId ? `/doctors/${data.doctorId}` : "/doctors"}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Try Again <ArrowRight size={15} />
                        </Link>
                    )}
                    <Link to="/" className="rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function BookingSuccessPage() {
    return <BookingStatusCard status="success" />;
}

export function BookingFailedPage() {
    return <BookingStatusCard status="failed" />;
}

export function BookingCancelledPage() {
    return <BookingStatusCard status="cancelled" />;
}