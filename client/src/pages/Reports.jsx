import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axiosConfig";
import PieChartComponent from "../components/Charts/PieChart";
import BarChartComponent from "../components/Charts/BarChart";
import Spinner from "../components/Spinner";

const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

export default function Reports() {
  const [month, setMonth] = useState(thisMonth);
  const [loading, setLoading] = useState(true);

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const balance = totalIncome - totalExpense;

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/reports/summary", { params: { month } });
      const data = res.data || {};

      const categories = Array.isArray(data.byCategory) ? data.byCategory : [];
      const monthly = Array.isArray(data.monthly) ? data.monthly : [];

      if (!categories.length && !monthly.length) {
        toast("No data found for this month.", { icon: "ℹ️" });
        setPieData([]);
        setBarData([]);
        setTotalIncome(0);
        setTotalExpense(0);
        return;
      }

      setPieData(
        categories.map((c) => ({
          name: c.name || c._id || "Unknown",
          value: Number(c.value || 0),
        }))
      );

      setBarData(
        monthly.map((m) => ({
          category: m.category || m.month || "",
          income: Number(m.income || 0),
          expense: Number(m.expense || 0),
        }))
      );

      setTotalIncome(Number(data.totalIncome || 0));
      setTotalExpense(Number(data.totalExpense || 0));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [month]);

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="card bg-base-100 shadow-sm rounded-2xl">
        <div className="card-body p-6 sm:p-7 md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <h1 className="text-2xl font-bold">Reports & Analytics</h1>
              <p className="text-sm text-base-content/70">
                Visualize your spending and income patterns.
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input input-bordered h-10 rounded-xl"
              />
              <button className="btn btn-outline h-10 rounded-xl" onClick={fetchReports}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total Income" value={totalIncome} tone="success" />
        <SummaryCard title="Total Expense" value={totalExpense} tone="error" />
        <SummaryCard
          title="Balance"
          value={balance}
          tone={balance >= 0 ? "success" : "error"}
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="card bg-base-100 rounded-2xl shadow-sm">
          <div className="card-body">
            <Spinner />
          </div>
        </div>
      ) : pieData.length === 0 && barData.length === 0 ? (
        <div className="card bg-base-100 rounded-2xl shadow-sm p-10 text-center text-base-content/70">
          No report data available for this month.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <PieChartComponent data={pieData} title="Expenses by Category" height={340} />
          <BarChartComponent data={barData} title="Income vs Expense" height={340} />
        </div>
      )}

      {/* Insights */}
      {!loading && (pieData.length > 0 || barData.length > 0) && (
        <div className="card bg-base-100 shadow-sm rounded-2xl">
          <div className="card-body p-6 sm:p-7 md:p-8 space-y-2">
            <h2 className="text-lg font-semibold">Insights</h2>

            <p className="text-base-content/70 text-sm md:text-base leading-relaxed">
              You {balance >= 0 ? "saved" : "overspent by"}{" "}
              <span
                className={`font-semibold ${balance >= 0 ? "text-success" : "text-error"
                  }`}
              >
                {formatCurrency(Math.abs(balance))}
              </span>{" "}
              this month.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

/* Helpers */

function SummaryCard({ title, value, tone = "neutral" }) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "error"
        ? "text-error"
        : "text-primary";

  return (
    <div className="card bg-base-100 shadow-sm rounded-2xl">
      <div className="card-body p-5">
        <h3 className="card-title text-base">{title}</h3>
        <p className={`text-3xl font-extrabold ${color}`}>
          {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
}

function formatCurrency(n, currency = "BDT") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));
}
