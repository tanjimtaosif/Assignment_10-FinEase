import { useState } from "react";
import api from "../lib/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { validateTransaction } from "../lib/validate";
import toast from "react-hot-toast";

const CATEGORY_PRESETS = [
  "Food",
  "Transport",
  "Shopping",
  "Salary",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

const TYPE_OPTIONS = ["Income", "Expense"];

export default function AddTransaction() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "Expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errors = validateTransaction(form);
    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    try {
      setLoading(true);
      await api.post("/api/transactions", {
        ...form,
        type: form.type.toLowerCase(),
        amount: Number(form.amount),
        email: user?.email,
        name: user?.displayName || "",
      });
      toast.success("Transaction added!");
      setForm({
        type: "Expense",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="card bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body p-6 sm:p-8">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-extrabold">Add Transaction</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Record income or expense. You can edit later from “My Transactions”.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={submit} className="mt-6 space-y-6">
            {/* Row 1: Type / Category */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* TYPE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Type</span>
                </label>
                <select
                  name="type"
                  className="select select-bordered w-full"
                  value={form.type}
                  onChange={onChange}
                  required
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* CATEGORY */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered w-full"
                  value={form.category}
                  onChange={onChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORY_PRESETS.map((c) => (
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
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={form.amount}
                  onChange={onChange}
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
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description (optional)</span>
              </label>
              <textarea
                name="description"
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Add a short note…"
                value={form.description}
                onChange={onChange}
              />
            </div>

            {/* Read-only user info */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">User Email</span>
                </label>
                <input
                  value={user?.email || ""}
                  readOnly
                  tabIndex="-1"
                  className="input w-full bg-base-200/50 border-transparent focus:outline-none focus:ring-0 focus:border-transparent cursor-default select-none"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">User Name</span>
                </label>
                <input
                  value={user?.displayName || ""}
                  readOnly
                  tabIndex="-1"
                  className="input w-full bg-base-200/50 border-transparent focus:outline-none focus:ring-0 focus:border-transparent cursor-default select-none"
                />
              </div>
            </div>

            {/* Bottom action row */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center h-11 rounded-xl
                           bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-semibold
                           transition-colors"
              >
                {loading ? "Saving..." : "Save Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
