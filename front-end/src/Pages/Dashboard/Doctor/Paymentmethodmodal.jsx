import React, { useState } from "react";
import { Loader2, X, Banknote, Smartphone, CreditCard, Info } from "lucide-react";

const PROVIDERS = [
    { id: "bkash", label: "bKash", sub: "Mobile wallet", color: "#E2136E", soft: "#FDE8F1", icon: Smartphone },
    { id: "nagad", label: "Nagad", sub: "Mobile wallet", color: "#F26522", soft: "#FEEEE4", icon: Smartphone },
    { id: "card", label: "International Card", sub: "Visa / Mastercard", color: "#2563EB", soft: "#EAF1FF", icon: CreditCard },
];

/*
    Usage (shared by DoctorProfilePage and BookAppointment):
    <PaymentMethodModal doctor={...} date={...} time={...} submitting={...} error={...}
        onClose={...} onConfirm={(method, provider) => ...} />
  method = "online" | "cash",  provider = "bkash" | "nagad" | "card" | null
*/
export default function PaymentMethodModal({ doctor, date, time, onClose, onConfirm, submitting, error }) {
    const [method, setMethod] = useState("online");
    const [provider, setProvider] = useState("bkash");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-slate-900">Confirm Appointment</h3>
                    <button type="button" onClick={onClose} disabled={submitting} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>

                <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3.5 text-sm">
                    <p className="flex justify-between"><span className="text-slate-400">Doctor</span><span className="font-medium text-slate-800">{doctor.name}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-medium text-slate-800">{date}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Time</span><span className="font-medium text-slate-800">{time}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Fee</span><span className="font-medium text-slate-800">৳{doctor.fee}</span></p>
                </div>

                <p className="mt-4 mb-2 text-sm font-medium text-slate-700">How would you like to pay?</p>

                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${method === "online" ? "border-blue-600 bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="pm" className="mt-0.5" checked={method === "online"} onChange={() => setMethod("online")} />
                    <span>
                        <span className="block text-sm font-medium text-slate-800">Pay Online</span>
                        <span className="block text-xs text-slate-400">bKash, Nagad or card — confirms instantly</span>
                    </span>
                </label>

                {method === "online" && (
                    <div className="mt-2 space-y-2 pl-1">
                        {PROVIDERS.map((p) => {
                            const Icon = p.icon;
                            const active = provider === p.id;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setProvider(p.id)}
                                    className="flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition"
                                    style={active ? { borderColor: p.color, background: p.soft } : { borderColor: "#e2e8f0" }}
                                >
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ background: p.color }}><Icon size={17} /></span>
                                    <span className="flex-1">
                                        <span className="block text-sm font-semibold text-slate-800">{p.label}</span>
                                        <span className="block text-[11px] text-slate-400">{p.sub}</span>
                                    </span>
                                    <span className="h-4 w-4 rounded-full border-2" style={active ? { borderColor: p.color, background: p.color, boxShadow: "inset 0 0 0 2px #fff" } : { borderColor: "#cbd5e1" }} />
                                </button>
                            );
                        })}
                        <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-700">
                            <Info size={13} className="mt-0.5 shrink-0" />
                            Demo mode: no real money is charged. You'll use test credentials on the next screen.
                        </p>
                    </div>
                )}

                <label className={`mt-2 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${method === "cash" ? "border-blue-600 bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="pm" className="mt-0.5" checked={method === "cash"} onChange={() => setMethod("cash")} />
                    <span className="flex items-start gap-2">
                        <Banknote size={16} className="mt-0.5 text-blue-600" />
                        <span>
                            <span className="block text-sm font-medium text-slate-800">Pay at Hospital</span>
                            <span className="block text-xs text-slate-400">Cash or card at the chamber</span>
                        </span>
                    </span>
                </label>

                {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}

                <div className="mt-5 flex gap-3">
                    <button type="button" onClick={onClose} disabled={submitting} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                    <button type="button" onClick={() => onConfirm(method, method === "online" ? provider : null)} disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {submitting ? "Booking…" : method === "online" ? "Continue" : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}