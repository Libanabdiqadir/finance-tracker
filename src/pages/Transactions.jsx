import { useState } from "react";
import { useFinance } from "../contexts/FinanceContext";

function Transactions() {
  const [filter, setFilter] = useState("All");
  const { transactions, incomeCategories, expenseCategories } = useFinance();

  const allCategories = [
    "All",
    ...new Set([...expenseCategories, ...incomeCategories]),
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "All") return true;
    return t.category === filter;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-800">
          Transaction History
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Filter:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 bg-white shadow-sm rounded-xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Category
              </th>
              <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.map((t) => {
              const isIncome = t.type === 'income' || t.amount > 0;

              return (
                <tr
                  key={t.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 text-sm text-slate-500 font-medium">

                    {t.date || (t.created_at ? new Date(t.created_at).toLocaleDateString() : "No Date")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {t.category || "General"}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-sm font-black text-right ${
                      isIncome ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {isIncome
                      ? `+$${Number(t.amount).toLocaleString()}`
                      : `-$${Math.abs(Number(t.amount)).toLocaleString()}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
