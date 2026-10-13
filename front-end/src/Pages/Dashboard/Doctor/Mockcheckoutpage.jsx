import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock, ShieldAlert, Clock, ArrowLeft } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

/* Brand colors and text (the official logo is not used). */
const THEMES = {
    bkash: { name: "bKash", color: "#E2136E", soft: "#FDE8F1", pinLen: 5, demoPin: "12345" },
    nagad: { name: "Nagad", color: "#F26522", soft: "#FEEEE4", pinLen: 4, demoPin: "1234" },
    card: { name: "International Card", color: "#2563EB", soft: "#EAF1FF" },
};
const WALLET_STEPS = ["Account", "Verification", "PIN"];
const FIELD_STEP = { account: 0, otp: 1, pin: 2 };

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

function Shell({ theme, children }) {
    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8">
            <div className="mx-auto max-w-md">
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p><b>DEMO MODE</b>: no real money is charged. Do not enter real card or wallet details.</p>
                </div>
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="px-6 py-5 text-white" style={{ background: theme.color }}>
                        <p className="text-xs uppercase tracking-widest opacity-80">Secure checkout (demo)</p>
                        <h1 className="mt-1 text-2xl font-bold">{theme.name}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

function Timer({ expiresAt }) {
    const [left, setLeft] = useState(() => new Date(expiresAt) - Date.now());
    useEffect(() => {
        const t = setInterval(() => setLeft(new Date(expiresAt) - Date.now()), 1000);
        return () => clearInterval(t);
    }, [expiresAt]);
    if (left <= 0) return <span className="text-rose-500">Expired</span>;
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    return <span>{m}:{String(s).padStart(2, "0")}</span>;
}

export default function MockCheckoutPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { data: session, isLoading, isError } = useQuery({
        queryKey: ["mock-payment", token],
        queryFn: async () => (await axiosSecure.get(`/api/payments/mock/${token}`)).data.session,
        retry: false,
    });

    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ account: "", otp: "", pin: "", cardNumber: "", cardName: "", expiry: "", cvv: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setError(""); };

    if (isLoading) {
        return <div className="grid min-h-screen place-items-center bg-slate-100"><Loader2 className="h-6 w-6 animate-spin text-slate-500" /></div>;
    }

    if (isError || !session) {
        return (
            <Shell theme={THEMES.card}>
                <div className="p-6 text-center">
                    <p className="text-sm text-slate-600">This payment link isn't valid.</p>
                    <Link to="/dashboard/my-appointments" className="mt-4 inline-block text-sm font-semibold text-blue-600">Go to my appointments</Link>
                </div>
            </Shell>
        );
    }

    const theme = THEMES[session.provider] || THEMES.card;
    const isCard = session.provider === "card";

    if (session.state !== "open") {
        const msg = { paid: "This appointment is already paid.", cancelled: "This payment was cancelled.", expired: "This payment session has expired." }[session.state];
        return (
            <Shell theme={theme}>
                <div className="p-6 text-center">
                    <p className="text-sm text-slate-600">{msg}</p>
                    <Link to={session.state === "paid" ? `/booking/success?appointmentId=${session.appointmentId}&method=online` : "/dashboard/my-appointments"} className="mt-4 inline-block text-sm font-semibold" style={{ color: theme.color }}>
                        {session.state === "paid" ? "View confirmation" : "Go to my appointments"}
                    </Link>
                </div>
            </Shell>
        );
    }

    const submit = async () => {
        setBusy(true);
        setError("");
        try {
            const body = isCard
                ? { cardNumber: form.cardNumber, cardName: form.cardName, expiry: form.expiry, cvv: form.cvv }
                : { account: form.account, otp: form.otp, pin: form.pin };
            const res = await axiosSecure.post(`/api/payments/mock/${token}/confirm`, body);
            navigate(`/booking/success?appointmentId=${res.data.appointmentId}&method=online`);
        } catch (err) {
            const d = err.response?.data;
            if (d?.declined) return navigate(`/booking/failed?appointmentId=${d.appointmentId || session.appointmentId}`);
            if (err.response?.status === 410) return navigate(`/booking/failed?appointmentId=${session.appointmentId}`);
            setError(d?.message || "Payment failed. Please try again.");
            if (d?.field in FIELD_STEP) setStep(FIELD_STEP[d.field]);
        } finally {
            setBusy(false);
        }
    };

    const cancel = async () => {
        try { await axiosSecure.post(`/api/payments/mock/${token}/cancel`); } catch { /* ignore */ }
        navigate(`/booking/cancelled?appointmentId=${session.appointmentId}`);
    };

    const next = () => {
        if (step === 0 && !/^01\d{9}$/.test(form.account)) return setError("Enter a valid 11-digit number (01XXXXXXXXX).");
        if (step === 1 && form.otp.length !== 6) return setError("Enter the 6-digit OTP.");
        setError("");
        if (step < 2) setStep(step + 1);
        else submit();
    };

    const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const fmtExpiry = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

    return (
        <Shell theme={theme}>
            <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{session.doctorName}</span>
                    <span className="text-xl font-bold text-slate-900">৳{session.amount}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{session.date} · {session.time_slot}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> <Timer expiresAt={session.expiresAt} /></span>
                </div>
            </div>

            <div className="px-6 py-5">
                {!isCard && (
                    <>
                        <ol className="mb-5 flex items-center gap-2 text-[11px] font-medium">
                            {WALLET_STEPS.map((s, i) => (
                                <li key={s} className="flex flex-1 items-center gap-2">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ background: i <= step ? theme.color : "#cbd5e1" }}>{i + 1}</span>
                                    <span className={i <= step ? "text-slate-700" : "text-slate-400"}>{s}</span>
                                </li>
                            ))}
                        </ol>

                        {step === 0 && (
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">Your {theme.name} account number</span>
                                <input autoFocus inputMode="numeric" maxLength={11} placeholder="01XXXXXXXXX" value={form.account} onChange={set("account")} className={inputCls} />
                                <span className="mt-1.5 block text-xs text-slate-400">Demo: any number like 01712345678</span>
                            </label>
                        )}
                        {step === 1 && (
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">Verification code (OTP)</span>
                                <input autoFocus inputMode="numeric" maxLength={6} placeholder="6-digit code" value={form.otp} onChange={set("otp")} className={inputCls} />
                                <span className="mt-1.5 block text-xs text-slate-400">Demo OTP: <b>123456</b></span>
                            </label>
                        )}
                        {step === 2 && (
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">Enter your {theme.name} PIN</span>
                                <input autoFocus type="password" inputMode="numeric" maxLength={theme.pinLen} placeholder={"•".repeat(theme.pinLen)} value={form.pin} onChange={set("pin")} className={`${inputCls} tracking-[0.5em]`} />
                                <span className="mt-1.5 block text-xs text-slate-400">Demo PIN: <b>{theme.demoPin}</b></span>
                            </label>
                        )}
                    </>
                )}

                {isCard && (
                    <div className="space-y-3.5">
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">Card number</span>
                            <input inputMode="numeric" placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={(e) => { setForm((f) => ({ ...f, cardNumber: fmtCard(e.target.value) })); setError(""); }} className={inputCls} autoComplete="off" />
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">Name on card</span>
                            <input placeholder="Full name" value={form.cardName} onChange={set("cardName")} className={inputCls} autoComplete="off" />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">Expiry</span>
                                <input inputMode="numeric" placeholder="MM/YY" value={form.expiry} onChange={(e) => { setForm((f) => ({ ...f, expiry: fmtExpiry(e.target.value) })); setError(""); }} className={inputCls} autoComplete="off" />
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">CVV</span>
                                <input type="password" inputMode="numeric" maxLength={4} placeholder="•••" value={form.cvv} onChange={set("cvv")} className={inputCls} autoComplete="off" />
                            </label>
                        </div>
                        <div className="rounded-xl p-3 text-xs leading-relaxed text-slate-600" style={{ background: theme.soft }}>
                            <p><b>Test cards</b></p>
                            <p>Success: 4242 4242 4242 4242</p>
                            <p>Declined: 4000 0000 0000 0002</p>
                            <p className="text-slate-400">Any future expiry, any 3-digit CVV, any name.</p>
                        </div>
                    </div>
                )}

                {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

                <div className="mt-5 flex gap-3">
                    {!isCard && step > 0 ? (
                        <button type="button" onClick={() => { setStep(step - 1); setError(""); }} disabled={busy} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><ArrowLeft size={18} /></button>
                    ) : (
                        <button type="button" onClick={cancel} disabled={busy} className="rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                    )}
                    <button
                        type="button"
                        onClick={isCard ? submit : next}
                        disabled={busy}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-base font-semibold text-white disabled:opacity-60"
                        style={{ background: theme.color }}
                    >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock size={15} />}
                        {isCard ? `Pay ৳${session.amount}` : step < 2 ? "Next" : `Confirm ৳${session.amount}`}
                    </button>
                </div>
            </div>
        </Shell>
    );
}