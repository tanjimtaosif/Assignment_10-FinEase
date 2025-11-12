import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function BarChartComponent({ data = [], height = 320, title = "Income vs Expense" }) {
    // Fixed bright colors (theme-safe)
    const incomeColor = "#10B981";  // emerald-500
    const expenseColor = "#EF4444"; // red-500

    // Soft grid + readable ticks in both themes
    const gridStroke = "rgba(107,114,128,0.25)"; // gray-500 @ 25%

    return (
        <div className="bg-base-100 shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} margin={{ top: 8, right: 16, left: -6, bottom: 0 }}>
                    <CartesianGrid stroke={gridStroke} />
                    <XAxis dataKey="category" tick={{ fill: "currentColor" }} />
                    <YAxis tick={{ fill: "currentColor" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--b1))",
                            borderColor: "hsl(var(--bc) / .2)",
                            borderRadius: "0.5rem",
                        }}
                        labelStyle={{ color: "hsl(var(--bc))" }}
                    />
                    <Legend wrapperStyle={{ color: "currentColor" }} />
                    <Bar dataKey="income" fill={incomeColor} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill={expenseColor} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
