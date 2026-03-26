import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { Trash2, Edit2, Plus, X, Check } from "lucide-react"; 
import { Doughnut } from "react-chartjs-2";

export default function TransactionForm({ type }) {
  const queryClient = useQueryClient();
  const isIncome = type === "income";

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("categories").select("*").eq("type", type).eq("user_id", user.id);
      return data || [];
    }
  });

  const { data: recentTransactions = [], isLoading } = useQuery({
    queryKey: ["recent-transactions", type],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("is_income", isIncome)
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      return data || [];
    }
  });

  const chartLabels = [...new Set(recentTransactions.map(t => t.category))];
  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Total',
      data: chartLabels.map(cat => 
        recentTransactions
          .filter(t => t.category === cat)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      ),
      backgroundColor: ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true, 
        callbacks: {
          label: (context) => ` ${context.label}: $${context.parsed.toLocaleString()}`
        }
      }
    }
  };

  const addCatMutation = useMutation({
    mutationFn: async (name) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (categories.some(c => c.name.toLowerCase() === name.toLowerCase().trim())) {
        throw new Error("Category already exists!");
      }

      const { error } = await supabase.from("categories").insert([
        { name: name.trim(), type, user_id: user.id }
      ]);
      
      if (error) throw error;
    },
    onError: (error) => alert(error.message),
    onSuccess: () => {
    queryClient.invalidateQueries(["recent-transactions", type]);
    refreshData();
    setAmount(""); 
    setSelectedCategory(""); 
    setEditingId(null);
  }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        amount: isIncome ? parseFloat(amount) : -Math.abs(parseFloat(amount)),
        category: selectedCategory,
        date: date, 
        is_income: isIncome,
        user_id: user.id
      };
      editingId 
        ? await supabase.from("transactions").update(payload).eq("id", editingId) 
        : await supabase.from("transactions").insert([payload]);
    },
    onSuccess: () => {
    queryClient.invalidateQueries(["recent-transactions", type]);
    refreshData();
    setAmount(""); 
    setSelectedCategory(""); 
    setEditingId(null);
  }
  });

  const deleteTransMutation = useMutation({
    mutationFn: async (id) => await supabase.from("transactions").delete().eq("id", id),
    onSuccess: () => queryClient.invalidateQueries(["recent-transactions", type])
  });

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setAmount(Math.abs(transaction.amount).toString());
    setSelectedCategory(transaction.category);
    if (transaction.date) setDate(transaction.date);
  };

  if (isLoading) return <div className="text-emerald-500 p-10 font-bold">Loading FinanceFlow...</div>;

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-1/3 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <h2 className={`text-2xl font-bold mb-6 ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
            {editingId ? "Edit" : "Add"} {type}
          </h2>
          <div className="space-y-4">
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-emerald-500" 
            />
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-emerald-500" 
            />
            
            <div className="flex gap-2">
              {!isAddingCat ? (
                <>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <button 
                    onClick={() => setIsAddingCat(true)}
                    className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-emerald-500 hover:bg-slate-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </>
              ) : (
                <div className="flex-1 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="New Category"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                  <button onClick={() => addCatMutation.mutate(newCatName)} className="p-3 text-emerald-500"><Check size={20}/></button>
                  <button onClick={() => setIsAddingCat(false)} className="p-3 text-rose-500"><X size={20}/></button>
                </div>
              )}
            </div>

            <button 
              onClick={() => saveMutation.mutate()} 
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isIncome ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
            >
              {editingId ? "Update" : "Save"} {type}
            </button>
            {editingId && (
              <button onClick={() => setEditingId(null)} className="w-full text-slate-500 text-sm underline">Cancel Edit</button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-2xl overflow-x-auto shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Recent {type}s</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 text-sm">
                <th className="pb-4">Date</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {recentTransactions.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-4 text-sm">{t.date || "No Date"}</td>
                  <td className="py-4 font-medium">{t.category}</td>
                  <td className={`py-4 font-bold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                    {Number(Math.abs(t.amount)).toLocaleString()}
                  </td>
                  <td className="py-4 text-right space-x-3">
                    <button onClick={() => startEdit(t)} className="text-slate-500 hover:text-white"><Edit2 size={16}/></button>
                    <button onClick={() => deleteTransMutation.mutate(t.id)} className="text-slate-500 hover:text-rose-500"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="w-full bg-slate-900 border border-slate-800 p-10 rounded-2xl flex flex-col items-center shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-8">Category Breakdown</h3>
        <div className="h-80 w-80">
          {recentTransactions.length > 0 ? (
            <Doughnut data={chartData} options={chartOptions} />
          ) : (
            <div className="text-slate-500 flex items-center h-full">Add data to see distribution</div>
          )}
        </div>
      </div>
    </div>
  );
}