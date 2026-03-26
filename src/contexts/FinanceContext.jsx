import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: transData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      setTransactions(transData || []);
      setIncomeCategories(catData?.filter(c => c.type === 'income').map(c => c.name) || []);
      setExpenseCategories(catData?.filter(c => c.type === 'expense').map(c => c.name) || []);
    } catch (error) {
      console.error("Error fetching context data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
    
    const subscription = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, fetchFinanceData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchFinanceData)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <FinanceContext.Provider value={{ 
      transactions, 
      incomeCategories, 
      expenseCategories, 
      refreshData: fetchFinanceData,
      loading 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);