import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axiosConfig";
import PieChartComponent from "../components/Charts/PieChart";
import BarChartComponent from "../components/Charts/BarChart";
import Spinner from "../components/Spinner";

const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

export default function Reports() {
  const [month, setMonth] = useState(thisMonth);
  const [loading, setLoading] = useState(true);

  // chart data
  const [pieData, setPieData] = useState([]); // [{ name, value }]
  const [barData, setBarData] = useState([]); // [{ category, income, expense }]

  // totals
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const expenseSum = pieData.reduce((a, b) => a + Number(b?.value || 0), 0);
    const incomeSum = barData.reduce((a, b) => a + Number(b?.income || 0), 0);
    return { totalExpense: expenseSum, totalIncome: incomeSum, balance: incomeSum - expenseSum };
  }, [pieData, barData]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/reports/summary", { params: { month } });
      const data = res?.data || {};
      const categories = data.byCategory || data.categories || [];
      const monthly = data.monthly || data.series || [];

      if (!categories.length && !monthly.length) {
        // soft fallback sample
        setPieData([
          { name: "Food", value: 250 },
          { name: "Transport", value: 120 },
          { name: "Shopping", value: 340 },
          { name: "Bills", value: 200 },
          { name: "Others", value: 100 },
        ]);
        setBarData([
          { category: "Income", income: 1200, expense: 0 },
          { category: "Expense", income: 0, expense: 910 },
        ]);
      } else {
        setPieData(categories.map((c) => ({ name: c.name, value: Number(c.value) || 0 })));
        setBarData(
          monthly.map((m) => ({
            category: m.category ?? m.month ?? "",
            income: Number(m.income) || 0,
            expense: Number(m.expense) || 0,
          }))
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load reports. Showing sample data.");
      setPieData([
        { name: "Food", value: 250 },
        { name: "Transport", value: 120 },
        { name: "Shopping", value: 340 },
        { name: "Bills", value: 200 },
        { name: "Others", value: 100 },
      ]);
      setBarData([
        { category: "Income", income: 1200, expense: 0 },
        { category: "Expense", income: 0, expense: 910 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card bg-base-100 shadow-sm rounded-2xl">
        <div className="card-body p-6 sm:p-7 md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <h1 className="text-2xl font-bold">Reports &amp; Analytics</h1>
              <p className="text-sm text-base-content/70">
                Visualize your spending by category and compare income vs expense.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="month"
                className="input input-bordered h-10 rounded-xl"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <button className="btn btn-outline h-10 rounded-xl" onClick={fetchReports}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total Income" value={totalIncome} tone="success" />
        <SummaryCard title="Total Expense" value={totalExpense} tone="error" />
        <SummaryCard title="Balance" value={balance} tone={balance >= 0 ? "success" : "error"} />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="card bg-base-100 rounded-2xl shadow-sm">
          <div className="card-body">
            <Spinner />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <PieChartComponent data={pieData} title="Expenses by Category" height={340} />
          <BarChartComponent data={barData} title="Income vs Expense" height={340} />
        </div>
      )}

      {/* Insights */}
      {!loading && (
        <div className="card bg-base-100 shadow-sm rounded-2xl">
          <div className="card-body">
            <h2 className="card-title">Insights</h2>
            <p className="text-base-content/70 leading-relaxed">
              You {balance >= 0 ? "saved" : "overspent by"}{" "}
              <span className={`font-semibold ${balance >= 0 ? "text-success" : "text-error"}`}>
                {formatCurrency(Math.abs(balance))}
              </span>{" "}
              this period. Review high-impact categories to optimize your budget.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

function SummaryCard({ title, value, tone = "neutral" }) {
  const color =
    tone === "success" ? "text-success" : tone === "error" ? "text-error" : "text-primary";
  return (
    <div className="card bg-base-100 shadow-sm rounded-2xl">
      <div className="card-body p-5">
        <h3 className="card-title text-base">{title}</h3>
        <p className={`text-3xl font-extrabold ${color}`}>{formatCurrency(value)}</p>
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
