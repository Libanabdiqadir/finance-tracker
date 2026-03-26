import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useFinance } from "../contexts/FinanceContext";

function Dashboard() {
  const { transactions } = useFinance();

  const { totals, growth, chartData } = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const sum = (arr) => arr.reduce((acc, t) => acc + Number(t.amount), 0);

    const totalIncome = sum(transactions.filter((t) => t.amount > 0));
    const totalExpense = Math.abs(
      sum(transactions.filter((t) => t.amount < 0)),
    );
    const balance = totalIncome - totalExpense;

    const thisMonthData = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const lastMonthData = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });

    const calculateGrowth = (current, prev) =>
      prev === 0
        ? current > 0
          ? 100
          : 0
        : ((current - prev) / Math.abs(prev)) * 100;

    const incomeGrowth = calculateGrowth(
      sum(thisMonthData.filter((t) => t.amount > 0)),
      sum(lastMonthData.filter((t) => t.amount > 0)),
    );

    const expenseGrowth = calculateGrowth(
      Math.abs(sum(thisMonthData.filter((t) => t.amount < 0))),
      Math.abs(sum(lastMonthData.filter((t) => t.amount < 0))),
    );

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.getMonth(),
        year: d.getFullYear(),
        label: d.toLocaleString("default", { month: "short" }),
      };
    });

    const labels = last6Months.map((m) => m.label);

    const incomeData = last6Months.map((m) => {
      return sum(
        transactions.filter((t) => {
          const d = new Date(t.date);
          return (
            t.amount > 0 &&
            d.getMonth() === m.month &&
            d.getFullYear() === m.year
          );
        }),
      );
    });

    const expenseData = last6Months.map((m) => {
      return Math.abs(
        sum(
          transactions.filter((t) => {
            const d = new Date(t.date);
            return (
              t.amount < 0 &&
              d.getMonth() === m.month &&
              d.getFullYear() === m.year
            );
          }),
        ),
      );
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };

    return {
      totals: { income: totalIncome, expense: totalExpense, balance },
      growth: { income: incomeGrowth, expense: expenseGrowth },
      chartData,
    };
  }, [transactions]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Financial Overview
        </h1>
        <p className="text-slate-500 text-sm">
          Real-time summary of your account
        </p>
      </div>

      {/* Grid for small cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Income"
          amount={totals.income}
          percent={growth.income}
          type="income"
        />
        <DashboardCard
          title="Total Expenses"
          amount={totals.expense}
          percent={growth.expense}
          type="expense"
        />
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Net Balance
          </p>
          <h2 className="text-3xl font-bold text-white">
            ${totals.balance.toLocaleString()}
          </h2>
          <p className="mt-4 text-slate-400 text-xs">Across all time</p>
        </div>
      </div>

      {/* 2. Place the Chart Section HERE (outside the grid) */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Cash Flow Trend</h3>
          <p className="text-slate-500 text-xs">
            Income vs Expenses over the last 6 months
          </p>
        </div>
        <div className="h-[300px] w-full">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
                x: { grid: { display: false } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, amount, percent, type }) {
  const isIncome = type === "income";

  const isPositiveTrend = isIncome ? percent >= 0 : percent <= 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
        {title}
      </p>
      <h2 className="text-3xl font-bold text-slate-900">
        ${amount.toLocaleString()}
      </h2>
      <div
        className={`mt-4 flex items-center text-sm font-medium ${isPositiveTrend ? "text-emerald-600" : "text-rose-600"}`}
      >
        <span>
          {percent >= 0 ? "▲" : "▼"} {Math.abs(percent).toFixed(1)}%
        </span>
        <span className="text-slate-400 ml-2 font-normal text-xs">
          from last month
        </span>
      </div>
    </div>
  );
}

export default Dashboard;
