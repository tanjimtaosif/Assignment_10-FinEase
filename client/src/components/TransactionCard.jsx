import { Link } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from "react-icons/hi2";

export default function TransactionCard({ txn, onDelete, currency = "USD", showActions = true, compact = false }) {
  if (!txn) return null;
  const isExpense = txn.type === "expense";
  const amountFmt = new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(txn.amount || 0));
  const dateStr = txn.date ? new Date(txn.date).toLocaleDateString() : "—";

  return (
    <div className={`card bg-base-100 shadow-sm ${compact ? "py-3" : ""}`}>
      <div className={`card-body ${compact ? "p-4 gap-3" : "p-6 gap-4"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`badge ${isExpense ? "badge-error" : "badge-success"} badge-outline`}>{txn.type?.toUpperCase() || "TYPE"}</span>
            <h3 className="font-semibold text-lg">{txn.category || "Uncategorized"}</h3>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${isExpense ? "text-error" : "text-success"}`}>{isExpense ? "-" : "+"}{amountFmt}</p>
            <p className="text-xs text-base-content/60">{dateStr}</p>
          </div>
        </div>

        {txn.description ? (
          <p className={`text-sm text-base-content/70 ${compact ? "line-clamp-1" : "line-clamp-2"}`}>{txn.description}</p>
        ) : (
          <p className="text-sm text-base-content/50 italic">No description</p>
        )}

        {showActions && (
          <div className="card-actions justify-end mt-1">
            <Link to={`/transaction/${txn._id}`} className="btn btn-ghost btn-sm gap-2"><HiOutlineEye /> Details</Link>
            <Link to={`/transaction/update/${txn._id}`} className="btn btn-outline btn-sm gap-2"><HiOutlinePencilSquare /> Edit</Link>
            <button onClick={() => onDelete?.(txn._id)} className="btn btn-error btn-sm gap-2"><HiOutlineTrash /> Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
