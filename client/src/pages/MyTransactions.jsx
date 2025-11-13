// src/pages/MyTransactions.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import api from "../lib/axiosConfig";
import toast from "react-hot-toast";
import TransactionCard from "../components/TransactionCard";
import Spinner from "../components/Spinner";
import {
    HiOutlineMagnifyingGlass,
    HiOutlineArrowPath,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const LIMIT = 8; // items per page (must match server default if you change it)

export default function MyTransactions() {
    const { user } = useAuth();

    const [items, setItems] = useState([]); // current page items
    const [total, setTotal] = useState(0); // total matching items in DB

    const [type, setType] = useState("all"); // all | income | expense
    const [sortBy, setSortBy] = useState("date"); // date | amount
    const [order, setOrder] = useState("desc"); // asc | desc
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState(null); // for delete modal

    // Debounce search text so we don't refetch on every keystroke
    const debouncedQ = useDebounce(q, 350);

    // ---------- Fetch from server with pagination + filters ----------
    useEffect(() => {
        if (!user?.email) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const params = {
                    email: user.email,
                    page,
                    limit: LIMIT,
                    sort: sortBy,
                    order,
                };

                if (type !== "all") params.type = type;
                if (debouncedQ) params.q = debouncedQ;

                const res = await api.get("/api/transactions", { params });

                const data = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : [];

                const totalCount =
                    typeof res.data?.total === "number" ? res.data.total : data.length;

                setItems(data || []);
                setTotal(totalCount);
            } catch (err) {
                console.error(err);
                toast.error(
                    err?.response?.data?.message || "Failed to load transactions"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.email, page, sortBy, order, type, debouncedQ]);

    // Reset to page 1 when filters/search change
    useEffect(() => {
        setPage(1);
    }, [sortBy, order, type, debouncedQ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    const startIndex = total === 0 ? 0 : (page - 1) * LIMIT + 1;
    const endIndex = total === 0 ? 0 : Math.min(total, page * LIMIT);

    // ---------- Delete handlers ----------
    const openConfirm = (id) => setConfirmId(id);
    const closeConfirm = () => setConfirmId(null);

    const handleDelete = async () => {
        if (!confirmId) return;
        try {
            await api.delete(`/api/transactions/${confirmId}`);
            toast.success("Transaction deleted");

            setItems((prev) => prev.filter((x) => x._id !== confirmId));
            setTotal((t) => Math.max(0, t - 1));

            if (items.length === 1 && page > 1) {
                setPage((p) => p - 1);
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Delete failed");
        } finally {
            closeConfirm();
        }
    };

    const handleReset = () => {
        setType("all");
        setSortBy("date");
        setOrder("desc");
        setQ("");
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* CONTROLS */}
            <div className="card bg-base-100 shadow-sm rounded-2xl">
                <div className="card-body p-6 sm:p-7">
                    <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
                        {/* Title + description */}
                        <div>
                            <h1 className="text-2xl font-bold">My Transactions</h1>
                            <p className="text-sm text-base-content/70">
                                Search, filter, and sort your records. Click a card for details.
                            </p>
                        </div>

                        {/* Filters row */}
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                            {/* Search */}
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex h-10 items-center rounded-xl border border-base-300 bg-base-200/60 px-3 gap-2">
                                    <HiOutlineMagnifyingGlass className="opacity-70 text-base" />
                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        className="grow bg-transparent outline-none placeholder:text-base-content/50 text-sm"
                                        placeholder="Search category or description"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-base-300/60"
                                    >
                                        <HiOutlineArrowPath className="text-sm" />
                                    </button>
                                </div>
                            </div>

                            {/* Type filter */}
                            <select
                                className="select select-bordered h-10 rounded-xl text-sm"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="all">All types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            {/* Sort by */}
                            <select
                                className="select select-bordered h-10 rounded-xl text-sm"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Sort by: Date</option>
                                <option value="amount">Sort by: Amount</option>
                            </select>

                            {/* Order */}
                            <select
                                className="select select-bordered h-10 rounded-xl text-sm"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                            >
                                <option value="desc">Desc</option>
                                <option value="asc">Asc</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="card bg-base-100 shadow-sm rounded-2xl">
                <div className="card-body p-6 sm:p-7">
                    {loading ? (
                        <div className="py-12">
                            <Spinner />
                        </div>
                    ) : items.length === 0 ? (
                        <EmptyState onReset={handleReset} />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((t) => (
                                <TransactionCard
                                    key={t._id}
                                    txn={t}
                                    onDelete={() => openConfirm(t._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PAGINATION */}
            {!loading && total > 0 && (
                <div className="flex flex-col gap-3 items-center justify-between text-sm sm:flex-row mt-2">
                    {/* Left: info text */}
                    <div className="text-base-content/70 text-center sm:text-left">
                        {total > 0 ? (
                            <>
                                Showing{" "}
                                <span className="font-medium">
                                    {startIndex}-{endIndex}
                                </span>{" "}
                                of <span className="font-medium">{total}</span> matching items
                            </>
                        ) : (
                            "No items"
                        )}
                    </div>

                    {/* Right: controls (always visible, just disabled if needed) */}
                    <div className="inline-flex items-center gap-2">
                        <button
                            className="btn btn-sm btn-outline rounded-xl flex items-center gap-1"
                            disabled={!hasPrev}
                            onClick={() => {
                                if (!hasPrev) return;
                                setPage((p) => Math.max(1, p - 1));
                            }}
                        >
                            <HiOutlineChevronLeft className="text-base" />
                            <span>Prev</span>
                        </button>

                        <button
                            className="btn btn-sm btn-primary rounded-xl flex items-center gap-1"
                            disabled={!hasNext}
                            onClick={() => {
                                if (!hasNext) return;
                                setPage((p) => Math.min(totalPages, p + 1));
                            }}
                        >
                            <span>Next</span>
                            <HiOutlineChevronRight className="text-base" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <ConfirmModal
                open={Boolean(confirmId)}
                onCancel={closeConfirm}
                onConfirm={handleDelete}
            />
        </div>
    );
}

/* ---------- Debounce Hook ---------- */
function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    const timer = useRef(null);
    useEffect(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer.current);
    }, [value, delay]);
    return debounced;
}

/* ---------- Modal + helpers ---------- */
function ConfirmModal({ open, onCancel, onConfirm }) {
    useLockBodyScroll(open);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div
                className="absolute inset-0 bg-white/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative z-10 flex min-h-full items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl bg-base-100 shadow-2xl p-6">
                    <h3 className="text-lg font-semibold mb-1">Delete transaction?</h3>
                    <p className="text-sm text-base-content/70 mb-5">
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm rounded-xl"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-error btn-sm rounded-xl"
                            onClick={onConfirm}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function useLockBodyScroll(active) {
    useEffect(() => {
        if (!active) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [active]);
}

/* ---------- Empty state ---------- */
function EmptyState({ onReset }) {
    return (
        <div className="text-center py-16">
            <img
                src="https://static.vecteezy.com/system/resources/previews/072/951/266/large_2x/3d-prohibition-icon-with-red-circle-and-cross-over-hand-holding-dollar-bill-symbol-of-no-cash-payment-restriction-and-finance-policy-isolated-on-transparent-background-free-png.png"
                alt="No transactions"
                className="w-48 mx-auto mb-4 opacity-90"
            />
            <h3 className="text-lg font-semibold">No transactions found</h3>
            <p className="text-sm text-base-content/70">
                Try adjusting filters or add a new transaction.
            </p>
            <div className="mt-5">
                <button
                    className="btn btn-outline btn-sm rounded-xl"
                    onClick={onReset}
                >
                    Reset filters
                </button>
            </div>
        </div>
    );
}
