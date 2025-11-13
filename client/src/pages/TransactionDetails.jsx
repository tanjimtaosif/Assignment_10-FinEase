import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/axiosConfig";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

export default function TransactionDetails() {
  const { id } = useParams();
  const [txn, setTxn] = useState(null);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);

        // Fetch the transaction by id
        const res = await api.get(`/api/transactions/${id}`);
        const tx = res.data?.data || res.data; // supports {data: {...}} or raw object

        if (!isMounted) return;
        setTxn(tx);

        // Fetch total for this category 
        try {
          const sumRes = await api.get("/api/reports/summary", {
            params: { category: tx.category },
          });
          const total = sumRes.data?.categoryTotal ?? 0;
          if (isMounted) setCategoryTotal(total);
        } catch (err) {
          console.error("Category summary failed", err);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          toast.error(
            err?.response?.data?.message ||
            "Failed to load transaction details"
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

  if (loading) {
    return (
      <div className="py-12">
        <Spinner />
      </div>
    );
  }

  if (!txn) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/70">Transaction not found.</p>
        <Link to="/my-transactions" className="btn btn-primary mt-4">
          Back to list
        </Link>
      </div>
    );
  }

  const isIncome = txn.type === "income";
  const amountNumber = Number(txn.amount || 0);
  const amountLabel = `${isIncome ? "+" : "-"}BDT ${amountNumber.toFixed(2)}`;

  return (
    <div className="card bg-base-100 shadow-sm rounded-2xl">
      <div className="card-body p-6 sm:p-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <p className="text-sm text-base-content/70">
              View full information about this transaction.
            </p>
          </div>
          <span
            className={`badge badge-lg ${isIncome ? "badge-success" : "badge-error"
              }`}
          >
            {isIncome ? "Income" : "Expense"}
          </span>
        </header>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Detail label="Category" value={txn.category} />
          <Detail label="Amount" value={amountLabel} />
          <Detail
            label="Date"
            value={new Date(txn.date).toLocaleDateString()}
          />
          <Detail
            label="User"
            value={`${txn.name || "Unknown"} (${txn.email || "N/A"})`}
          />
          <Detail
            label="Description"
            value={txn.description || "No description provided."}
            className="md:col-span-2"
          />
        </div>

        {/* Category total */}
        <div className="mt-4 rounded-xl bg-base-200/60 px-4 py-3 text-sm text-base-content/80">
          <span>
            Total amount for <b>{txn.category}</b>:{" "}
            <b>BDT {Number(categoryTotal || 0).toFixed(2)}</b>
          </span>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/my-transactions"
            className="btn btn-ghost btn-sm sm:btn-md w-full sm:w-auto"
          >
            Back to list
          </Link>
          <Link
            to={`/transaction/update/${txn._id}`}
            className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, className = "" }) {
  return (
    <div
      className={`p-3 rounded-xl bg-base-100 border border-base-300/60 ${className}`}
    >
      <p className="text-xs uppercase tracking-wide text-base-content/60 mb-0.5">
        {label}
      </p>
      <p className="font-medium break-words">{value}</p>
    </div>
  );
}
