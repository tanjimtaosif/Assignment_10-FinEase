// src/pages/MyTransactions.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/axiosConfig";
import toast from "react-hot-toast";
import TransactionCard from "../components/TransactionCard";
import Spinner from "../components/Spinner";
import { HiOutlineMagnifyingGlass, HiOutlineArrowPath } from "react-icons/hi2";

const LIMIT = 8; // items per page

export default function MyTransactions() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [type, setType] = useState("all");          // all | income | expense
    const [sortBy, setSortBy] = useState("date");     // date | amount
    const [order, setOrder] = useState("desc");       // asc | desc
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState(null); // for delete modal

    // Debounce search text so we don't refetch on every keystroke
    const debouncedQ = useDebounce(q, 350);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.set("limit", String(LIMIT));
        params.set("page", String(page));
        params.set("sort", sortBy);
        params.set("order", order);
        if (debouncedQ) params.set("q", debouncedQ);
        if (type !== "all") params.set("type", type);
        return params.toString();
    }, [page, sortBy, order, debouncedQ, type]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/transactions?${queryString}`);
            const data = Array.isArray(res.data?.data) ? res.data.data : res.data;
            setItems(data || []);
            setTotal(Number(res.data?.total ?? data?.length ?? 0));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString]);

    // When filters change (not page), reset to first page
    useEffect(() => {
        setPage(1);
    }, [sortBy, order, type, debouncedQ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    // Delete handlers
    const openConfirm = (id) => setConfirmId(id);
    const closeConfirm = () => setConfirmId(null);

    const handleDelete = async () => {
        if (!confirmId) return;
        try {
            await api.delete(`/api/transactions/${confirmId}`);
            toast.success("Transaction deleted");
            setItems((prev) => prev.filter((x) => x._id !== confirmId));
            setTotal((t) => Math.max(0, t - 1));
        } catch (err) {
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
            {/* Controls */}
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
                                <div className="flex h-10 items-center rounded-xl border border-base-300/70 bg-base-200/50 px-3 gap-2">
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
                                        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-base-300/60"
                                        title="Reset filters"
                                        aria-label="Reset filters"
                                    >
                                        <HiOutlineArrowPath className="text-sm" />
                                    </button>
                                </div>
                            </div>

                            {/* Type */}
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

            {/* List */}
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
                                <TransactionCard key={t._id} txn={t} onDelete={() => openConfirm(t._id)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {!loading && items.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                    <div className="text-base-content/70">
                        Page <span className="font-medium">{page}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                        {typeof total === "number" && total > 0 && (
                            <>
                                {" "}• Total <span className="font-medium">{total}</span> items
                            </>
                        )}
                    </div>
                    <div className="join">
                        <button
                            className="join-item btn btn-sm rounded-l-xl"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <button
                            className="join-item btn btn-sm rounded-r-xl"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            <dialog className="modal" open={Boolean(confirmId)} onClose={closeConfirm}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete transaction?</h3>
                    <p className="py-2 text-base-content/70">This action cannot be undone.</p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button className="btn" onClick={closeConfirm} type="button">
                                Cancel
                            </button>
                            <button className="btn btn-error" type="button" onClick={handleDelete}>
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeConfirm}>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}

/** Simple debounce hook */
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

/** Empty state component */
function EmptyState({ onReset }) {
    return (
        <div className="text-center py-16">
            <img
                src="https://illustrations.popsy.co/gray/organize.svg"
                alt="No transactions"
                className="w-48 mx-auto mb-4 opacity-90"
            />
            <h3 className="text-lg font-semibold">No transactions found</h3>
            <p className="text-sm text-base-content/70">
                Try adjusting filters or add a new transaction.
            </p>
            <div className="mt-5">
                <button className="btn btn-outline btn-sm rounded-xl" onClick={onReset}>
                    Reset filters
                </button>
            </div>
        </div>
    );
}
