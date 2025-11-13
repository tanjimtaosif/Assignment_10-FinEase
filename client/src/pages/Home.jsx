// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axiosConfig";
import photo from "../assets/banking-financial.png";

const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD", // change to "BDT" if you want BDT here
});

export default function Home() {
    const { user } = useAuth();
    const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.email) {
            setSummary({ balance: 0, income: 0, expense: 0 });
            return;
        }

        let ignore = false;

        (async () => {
            try {
                setLoading(true);

                const res = await api.get("/api/transactions/summary", {
                    params: { email: user.email },
                });

                const data = res.data || {};
                if (ignore) return;

                const income = Number(data.income || 0);
                const expense = Number(data.expense || 0);
                const balance =
                    typeof data.balance === "number" ? data.balance : income - expense;

                setSummary({ income, expense, balance });
            } catch (err) {
                console.error("Failed to load overview:", err?.response?.data || err);
                if (!ignore) {
                    setSummary({ balance: 0, income: 0, expense: 0 });
                }
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
            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-base-200 to-base-100">
                {/* background accents */}
                <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary/10 blur-2xl" />

                {/* content */}
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-8 sm:px-8 lg:px-12 lg:py-12 md:flex-row">
                    {/* IMAGE – gets half the space, scales down instead of cropping */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src={photo}
                            alt="Finance illustration"
                            loading="eager"
                            className="w-full max-w-[640px] h-auto object-contain"
                        />
                    </div>

                    {/* TEXT – shares the other half, wraps nicely on small screens */}
                    <div className="flex-1 max-w-xl text-center md:text-left">
                        <p className="text-base-content/80 text-xl sm:text-2xl italic leading-relaxed">
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
                            <StatCard
                                title="Total Balance"
                                value={fmt.format(summary.balance)}
                                variant="balance"
                            />
                            <StatCard
                                title="Total Income"
                                value={fmt.format(summary.income)}
                                variant="income"
                            />
                            <StatCard
                                title="Total Expense"
                                value={fmt.format(summary.expense)}
                                variant="expense"
                            />
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
                        <h3 className="card-title font-bold mb-3 text-lg">
                            Why Financial Planning Matters
                        </h3>
                        <p className="text-base-content/70 leading-relaxed">
                            Small daily choices compound into big long-term results. Clear
                            visibility of your spending habits is the first step to
                            improvement.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- Stat cards with gradients ---------- */

function StatCard({ title, value, variant }) {
    let bgClasses = "";
    switch (variant) {
        case "balance":
            bgClasses = "bg-gradient-to-tr from-sky-500 to-indigo-500";
            break;
        case "income":
            bgClasses = "bg-gradient-to-tr from-emerald-500 to-teal-500";
            break;
        case "expense":
            bgClasses = "bg-gradient-to-tr from-rose-500 to-red-500";
            break;
        default:
            bgClasses = "bg-base-100";
    }

    return (
        <div className={`card rounded-2xl shadow-md text-white ${bgClasses}`}>
            <div className="card-body p-6 sm:p-8">
                <h3 className="card-title font-semibold text-sm sm:text-base text-white/90">
                    {title}
                </h3>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
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
