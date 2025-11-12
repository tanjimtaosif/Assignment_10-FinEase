// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

export default function Home() {
    const { user } = useAuth();
    const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.email) return;
        let ignore = false;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/analytics/summary?email=${encodeURIComponent(user.email)}`);
                if (!res.ok) throw new Error("Failed to load overview");
                const data = await res.json();
                if (!ignore)
                    setSummary({
                        balance: data.balance || 0,
                        income: data.income || 0,
                        expense: data.expense || 0,
                    });
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [user?.email]);

    const showOverview = !!user?.email;

    return (
        <div className="space-y-10 md:space-y-12">
            {/* HERO - minimal and elegant */}
            <section className="relative rounded-3xl bg-gradient-to-tr from-base-200 to-base-100 overflow-hidden">
                {/* background accents */}
                <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary/10 blur-2xl" />

                <div className="grid items-center gap-8 md:grid-cols-2 p-6 sm:p-8 lg:p-12">
                    {/* IMAGE - soft shadow, no border */}
                    <div className="flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=1600&auto=format&fit=crop"
                            alt="Finance dashboard preview"
                            className="w-full max-w-[560px] aspect-video object-cover rounded-2xl shadow-2xl"
                            loading="eager"
                        />
                    </div>

                    {/* TEXT - only tagline + quote */}
                    <div className="max-w-xl mx-auto text-center md:text-left">
                        <p className="mt-6 text-base-content/80 text-xl italic leading-relaxed">
                            “A budget is telling your money where to go instead of wondering where it went.”
                        </p>
                    </div>
                </div>
            </section>

            {/* OVERVIEW (only when logged in) */}
            {showOverview && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <>
                            <SkeletonCard title="Total Balance" />
                            <SkeletonCard title="Total Income" />
                            <SkeletonCard title="Total Expense" />
                        </>
                    ) : (
                        <>
                            <StatCard title="Total Balance" value={fmt.format(summary.balance)} />
                            <StatCard title="Total Income" value={fmt.format(summary.income)} tone="success" />
                            <StatCard title="Total Expense" value={fmt.format(summary.expense)} tone="error" />
                        </>
                    )}
                </section>
            )}

            {/* STATIC SECTIONS */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="card bg-base-100 shadow-md rounded-2xl">
                    <div className="card-body p-6 sm:p-8">
                        <h3 className="card-title font-bold mb-3 text-lg">Budgeting Tips</h3>
                        <ul className="list-disc pl-5 space-y-1 text-base-content/70">
                            <li>Pay yourself first (save 10–20%).</li>
                            <li>Use categories to spot overspending.</li>
                            <li>Review reports at the end of each month.</li>
                        </ul>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md rounded-2xl">
                    <div className="card-body p-6 sm:p-8">
                        <h3 className="card-title font-bold mb-3 text-lg">Why Financial Planning Matters</h3>
                        <p className="text-base-content/70 leading-relaxed">
                            Small daily choices compound into big long-term results. Clear visibility of your
                            spending habits is the first step to improvement.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- small components ---------- */

function StatCard({ title, value, tone = "neutral" }) {
    const toneClass =
        tone === "success" ? "text-success" : tone === "error" ? "text-error" : "text-primary";
    return (
        <div className="card bg-base-100 shadow-sm rounded-2xl">
            <div className="card-body p-6 sm:p-8">
                <h3 className="card-title font-bold">{title}</h3>
                <p className={`text-2xl sm:text-3xl font-bold ${toneClass}`}>{value}</p>
            </div>
        </div>
    );
}

function SkeletonCard({ title }) {
    return (
        <div className="card bg-base-100 shadow-sm rounded-2xl">
            <div className="card-body p-6 sm:p-8">
                <h3 className="card-title font-bold">{title}</h3>
                <div className="mt-2 h-7 w-28 rounded bg-base-300 animate-pulse" />
            </div>
        </div>
    );
}
