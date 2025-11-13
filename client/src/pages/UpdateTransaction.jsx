import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axiosConfig";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { validateTransaction } from "../lib/validate";
import { useAuth } from "../context/AuthContext";

const TYPE_OPTIONS = ["Income", "Expense"];

const EXPENSE_CATEGORIES = [
    "Home",
    "Food",
    "Transportation",
    "Health",
    "Personal",
    "Education",
    "Technology",
    "Entertainment",
    "Family",
    "Others",
];

const INCOME_CATEGORIES = ["Salary", "Pocket Money", "Business"];

function getCategoriesForType(typeLabel) {
    const t = (typeLabel || "").toLowerCase();
    return t === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export default function UpdateTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load existing transaction
    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/transactions/${id}`);
                const tx = res.data?.data || res.data;

                if (!isMounted) return;

                setForm({
                    // UI label
                    type: tx.type === "income" ? "Income" : "Expense",
                    category: tx.category || "",
                    amount: tx.amount ?? "",
                    description: tx.description || "",
                    date: tx.date ? String(tx.date).slice(0, 10) : "",
                });
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    toast.error(
                        err?.response?.data?.message || "Failed to load transaction"
                    );
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, [id]);

    // Generic handler for non-type fields
    const onFieldChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // Special handler for type, so we can adjust categories
    const onTypeChange = (e) => {
        const newType = e.target.value;
        setForm((prev) => {
            const allowed = getCategoriesForType(newType);
            const keepCategory = allowed.includes(prev.category) ? prev.category : "";
            return {
                ...prev,
                type: newType,
                category: keepCategory,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form) return;

        // normalize for validation & payload
        const normalized = {
            ...form,
            type: form.type.toLowerCase(), // "income" | "expense"
        };

        const errors = validateTransaction(normalized);
        if (Object.keys(errors).length) {
            toast.error(Object.values(errors)[0]);
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...normalized,
                amount: Number(normalized.amount),
                description: normalized.description?.trim() || "",
                //  include email & name just like in createTransaction
                email: user?.email || "",
                name: user?.displayName || "",
            };

            await api.put(`/api/transactions/${id}`, payload);

            toast.success("Transaction updated");
            navigate(`/transaction/${id}`);
        } catch (err) {
            console.error("Update error:", err?.response?.data || err);
            toast.error(
                err?.response?.data?.message || "Update failed. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading || !form) {
        return (
            <div className="py-12">
                <Spinner />
            </div>
        );
    }

    // categories based on current type
    const baseCategories = getCategoriesForType(form.type);
    const needsExtra =
        form.category && !baseCategories.includes(form.category)
            ? [form.category]
            : [];
    const categoryOptions = [...needsExtra, ...baseCategories];

    return (
        <section className="max-w-3xl mx-auto">
            <div className="card bg-base-100 shadow-xl rounded-2xl">
                <div className="card-body p-6 sm:p-8">
                    <header>
                        <h1 className="text-3xl font-extrabold">Update Transaction</h1>
                        <p className="text-sm text-base-content/70 mt-1">
                            Adjust the details of this record and save your changes.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        {/* Row 1: Type / Category */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Type</span>
                                </label>
                                <select
                                    name="type"
                                    className="select select-bordered w-full"
                                    value={form.type}
                                    onChange={onTypeChange}
                                    required
                                >
                                    {TYPE_OPTIONS.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Category</span>
                                </label>
                                <select
                                    name="category"
                                    className="select select-bordered w-full"
                                    value={form.category}
                                    onChange={onFieldChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categoryOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Amount / Date */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Amount</span>
                                </label>
                                <input
                                    name="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="input input-bordered w-full"
                                    value={form.amount}
                                    onChange={onFieldChange}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Date</span>
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={form.date}
                                    onChange={onFieldChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Description</span>
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                className="textarea textarea-bordered w-full"
                                placeholder="Add a short note…"
                                value={form.description}
                                onChange={onFieldChange}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center h-11 rounded-xl
                  bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-semibold
                  transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
