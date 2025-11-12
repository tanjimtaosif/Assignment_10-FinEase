import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/axiosConfig";
import toast from "react-hot-toast";

export default function TransactionDetails() {
  const { id } = useParams();
  const [txn, setTxn] = useState(null);
  const [categoryTotal, setCategoryTotal] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // TODO: replace with real API
        const res = await api.get(`/api/transactions/${id}`);
        setTxn(res.data);
        const sum = await api.get(`/api/reports/summary?category=${res.data.category}`);
        setCategoryTotal(sum.data?.categoryTotal ?? 0);
      } catch (err) {
        toast.error("Failed to load details");
      }
    })();
  }, [id]);

  if (!txn) {
    return (
      <div className="grid place-items-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h1 className="card-title">Transaction Details</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Detail label="Type" value={txn.type} />
          <Detail label="Category" value={txn.category} />
          <Detail label="Amount" value={`$${Number(txn.amount).toFixed(2)}`} />
          <Detail label="Date" value={new Date(txn.date).toLocaleDateString()} />
          <Detail label="Description" value={txn.description || "—"} className="md:col-span-2" />
          <Detail label="User" value={`${txn.name} (${txn.email})`} className="md:col-span-2" />
        </div>

        <div className="alert mt-4">
          <span>
            Total amount for category <b>{txn.category}</b>:{" "}
            <b>${Number(categoryTotal).toFixed(2)}</b>
          </span>
        </div>

        <div className="card-actions justify-end">
          <Link to={`/transaction/update/${txn._id}`} className="btn btn-outline">
            Edit
          </Link>
          <Link to="/my-transactions" className="btn btn-primary">
            Back to list
          </Link>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, className = "" }) {
  return (
    <div className={`p-3 rounded-lg bg-base-200 ${className}`}>
      <p className="text-xs uppercase tracking-wide text-base-content/60">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
