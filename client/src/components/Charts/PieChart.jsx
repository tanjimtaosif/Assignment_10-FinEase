import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PieChartComponent({ data = [], title = "Expense Breakdown", height = 320 }) {
    // Vibrant, theme-safe palette
    const COLORS = [
        "#3B82F6", // blue-500
        "#10B981", // emerald-500
        "#F59E0B", // amber-500
        "#EF4444", // red-500
        "#8B5CF6", // violet-500
        "#06B6D4", // cyan-500
        "#F472B6", // pink-400
        "#22C55E", // green-500
        "#EAB308", // yellow-500
    ];

    return (
        <div className="bg-base-100 shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius="80%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--b1))",
                            borderColor: "hsl(var(--bc) / .2)",
                            borderRadius: "0.5rem",
                        }}
                        labelStyle={{ color: "hsl(var(--bc))" }}
                    />
                    <Legend wrapperStyle={{ color: "currentColor" }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
