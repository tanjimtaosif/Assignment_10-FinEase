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

  /** FORMAT AMOUNT */
  const amountFmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(txn.amount || 0));

  /** FORMAT DATE */
  const dateStr = txn.date
    ? new Date(txn.date).toLocaleDateString()
    : "—";

  /** MATCH OVERVIEW PAGE GRADIENTS */
  const cardBg = isExpense
    ? "bg-gradient-to-br from-rose-500 to-red-600" 
    : "bg-gradient-to-br from-emerald-500 to-teal-600"; 

  const textPrimary = "text-white";
  const textSecondary = "text-white/80";

  return (
    <div className={`card rounded-xl shadow-md h-full ${cardBg}`}>
      <div className={`card-body flex flex-col ${compact ? "p-4" : "p-6"} ${textPrimary}`}>

        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`badge border-white text-white bg-white/20 backdrop-blur-sm`}
            >
              {txn.type?.toUpperCase()}
            </span>

            <h3 className="font-semibold text-lg">{txn.category}</h3>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">
              {isExpense ? "-" : "+"}
              {amountFmt}
            </p>
            <p className={`text-xs ${textSecondary}`}>{dateStr}</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className={`text-sm ${textSecondary}`}>
          {txn.description || (
            <span className="italic opacity-80">No description</span>
          )}
        </p>

        {/* ACTIONS */}
        {showActions && (
          <div className="mt-4 pt-3 border-t border-white/30 flex items-center justify-between">

            <div className="flex gap-3">
              <Link
                to={`/transaction/${txn._id}`}
                className="flex items-center gap-1 text-sm font-medium hover:text-white"
              >
                <HiOutlineEye className="text-lg" />
                <span>Details</span>
              </Link>

              <Link
                to={`/transaction/update/${txn._id}`}
                className="flex items-center gap-1 text-sm font-medium hover:text-white"
              >
                <HiOutlinePencilSquare className="text-lg" />
                <span>Edit</span>
              </Link>
            </div>

            <button
              onClick={() => onDelete?.(txn._id)}
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-red-200"
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
