import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Transactions from "./pages/Transactions";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import TransactionForm from "./pages/TransactionForm";


function App() {
  const location = useLocation();

  const hideNavbarpaths = ['/login', '/signup'];
  const isAuthPage = hideNavbarpaths.includes(location.pathname);

  return (
    <>
    <div className={`flex min-h-screen ${isAuthPage ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${isAuthPage ? 'p-0' : 'p-8'}`}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />

          <Route path="/login" element={<LogIn />}/>

          <Route 
              path="/add-income" 
              element={<ProtectedRoute><TransactionForm type="income" /></ProtectedRoute>} 
            />
          <Route 
              path="/add-expense" 
              element={<ProtectedRoute><TransactionForm type="expense" /></ProtectedRoute>} 
            />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute> <Transactions /> </ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  </>
  );
}

export default App;
