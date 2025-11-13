import { Link } from "react-router-dom";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi2";

export default function TransactionCard({
  txn,
  onDelete,
  currency = "BDT",
  showActions = true,
  compact = false,
}) {
  if (!txn) return null;

  const isExpense = txn.type === "expense";
  const amountFmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(txn.amount || 0));
  const dateStr = txn.date
    ? new Date(txn.date).toLocaleDateString()
    : "—";

  return (
    <div className="card bg-base-100 rounded-xl shadow-md h-full">
      <div className={`card-body flex flex-col ${compact ? "p-4" : "p-6"}`}>

        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`badge badge-outline ${isExpense ? "badge-error" : "badge-success"
                }`}
            >
              {txn.type?.toUpperCase()}
            </span>
            <h3 className="font-semibold text-lg">{txn.category}</h3>
          </div>

          <div className="text-right">
            <p className={`text-2xl font-bold ${isExpense ? "text-error" : "text-success"}`}>
              {isExpense ? "-" : "+"}
              {amountFmt}
            </p>
            <p className="text-xs text-base-content/60">{dateStr}</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-base-content/70">
          {txn.description || <span className="italic text-base-content/50">No description</span>}
        </p>

        {/* ACTIONS */}
        {showActions && (
          <div className="mt-3 pt-3 border-t border-base-300 flex items-center justify-between">

            {/* LEFT ACTIONS */}
            <div className="flex gap-3">

              <Link
                to={`/transaction/${txn._id}`}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary"
              >
                <HiOutlineEye className="text-lg" />
                <span>Details</span>
              </Link>

              <Link
                to={`/transaction/update/${txn._id}`}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary"
              >
                <HiOutlinePencilSquare className="text-lg" />
                <span>Edit</span>
              </Link>
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => onDelete?.(txn._id)}
              className="flex items-center gap-1 text-sm font-medium text-error hover:text-error-content"
            >
              <HiOutlineTrash className="text-lg" />
              <span>Delete</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
