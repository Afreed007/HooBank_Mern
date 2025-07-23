import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = "http://localhost:5000/api/auth";

  // Get user data on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // First, try to get user data from navigation state (direct from login)
        if (location.state?.user) {
          const userData = location.state.user;
          setUser(userData);
          setTransactions(userData.transactions || []);
          setBalance(userData.accountDetails?.balance || 0);
          setLoading(false);
          return;
        }

        // If not from navigation, try localStorage
        const storedToken = localStorage.getItem('bankingToken');
        const storedUserData = localStorage.getItem('userData');

        if (!storedToken) {
          // No token, redirect to login
          navigate('/');
          return;
        }

        if (storedUserData) {
          // Use stored data first, then verify with backend
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          setTransactions(userData.transactions || []);
          setBalance(userData.accountDetails?.balance || 0);
        }

        // Verify token and get fresh data from backend
        const response = await fetch(`${API_BASE}/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("VERIFY RESPONSE:", data);//remove it later
          const userData = data.user;
          
          // Update state with fresh data
          setUser(userData);
          setTransactions(userData.transactions || []);
          setBalance(userData.accountDetails?.balance || 0);
          
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          // Token invalid, clear storage and redirect
          localStorage.removeItem('bankingToken');
          localStorage.removeItem('userData');
          navigate('/');
          return;
        }

      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate, location.state]);

  // Calculate balance from transactions if not provided by backend
  useEffect(() => {
    if (transactions.length > 0 && !user?.accountDetails?.balance) {
      const calculatedBalance = transactions.reduce((acc, txn) => {
        // For our system, we'll use the balanceAfter from the most recent transaction
        // or calculate running balance
        return txn.balanceAfter || acc + txn.amount;
      }, 0);
      setBalance(calculatedBalance);
    }
  }, [transactions, user]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('bankingToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Refresh dashboard data
  const refreshData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('bankingToken');
      
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`${API_BASE}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        
        setUser(userData);
        setTransactions(userData.transactions || []);
        setBalance(userData.accountDetails?.balance || 0);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format amount for display
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  // Prepare chart data (spending trends - negative amounts only)
  const chartData = transactions
    .filter(txn => txn.amount < 0)
    .map(txn => ({
      date: formatDate(txn.createdAt),
      amount: txn.amount,
      description: txn.description
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Loading state
  if (loading) {
    return (
      <div className="bg-primary w-full min-h-screen flex flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-gradient"></div>
          <p className="text-white mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-primary w-full min-h-screen flex flex-col justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-2 bg-blue-gradient text-primary font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="bg-primary w-full min-h-screen flex flex-col justify-center items-center p-8">
      {/* Header with user info and logout */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Banking Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome back, {user?.accountDetails?.accountHolderName || 'User'}
          </p>
          <p className="text-sm text-gray-400">
            Account: {user?.accountNumber} | Last login: {user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
        <h2 className="text-xl font-semibold text-gradient">
          Account Summary
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-green-300">
              {formatAmount(balance)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Account Holder</p>
            <p className="text-white font-semibold">
              {user?.accountDetails?.accountHolderName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Transactions</p>
            <p className="text-white font-semibold">
              {transactions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl mt-6 border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gradient">
            Transaction History
          </h2>
          <p className="text-sm text-gray-400">
            Showing last {transactions.length} transactions
          </p>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-80">
            <table className="w-full text-left border-collapse text-white">
              <thead>
                <tr>
                  <th className="p-2 border-b border-gray-300">Date</th>
                  <th className="p-2 border-b border-gray-300">Description</th>
                  <th className="p-2 border-b border-gray-300">Type</th>
                  <th className="p-2 border-b border-gray-300">Amount</th>
                  <th className="p-2 border-b border-gray-300">Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={txn._id || index} className="border-b border-gray-300 hover:bg-blue-600 transition-all duration-300">
                    <td className="p-2 text-sm">
                      {formatDate(txn.createdAt)}
                    </td>
                    <td className="p-2">
                      {txn.description || 'Transaction'}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        txn.type === 'credit' ? 'bg-green-600' : 
                        txn.type === 'debit' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {txn.type ? txn.type.toUpperCase() : 'N/A'}
                      </span>
                    </td>
                    <td className={`p-2 font-semibold ${
                      txn.amount > 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {txn.amount > 0 ? '+' : ''}{formatAmount(txn.amount)}
                    </td>
                    <td className="p-2 text-xs text-gray-400">
                      {txn.reference || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spending Analytics */}
      <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl mt-6 border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
        <h2 className="text-xl font-semibold text-gradient mb-4">
          Spending Trends
        </h2>
        {chartData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No spending data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#ffffff" fontSize={12} />
              <YAxis stroke="#ffffff" domain={["auto", 0]} fontSize={12} />
              <Tooltip 
                wrapperStyle={{ 
                  backgroundColor: '#ffffff', 
                  color: '#000000',
                  borderRadius: '8px',
                  border: 'none'
                }}
                formatter={(value, name) => [formatAmount(value), 'Amount']}
                labelStyle={{ color: '#000000' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#ff4c4c" 
                strokeWidth={2}
                dot={{ fill: '#ff4c4c', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#ff4c4c', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;













// import React, { useState, useEffect } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { users } from "../constants";

// const Dashboard = () => {
//   const userId = "1001"; // Example user ID
//   const user = users[userId];
//   const transactions = user.transactions;
  
//   const [balance, setBalance] = useState(0);

//   useEffect(() => {
//     const totalBalance = transactions.reduce((acc, txn) => acc + txn.amount, 0);
//     setBalance(totalBalance);
//   }, [transactions]);

//   return (
//     <div className="bg-primary w-full min-h-screen flex flex-col justify-center items-center p-8">
//       <h1 className="text-3xl font-bold text-gradient mb-6">
//         Banking Dashboard
//       </h1>

//       {/* Account Summary */}
//       <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
//         <h2 className="text-xl font-semibold text-gradient">
//           Account Summary
//         </h2>
//         <p className="mt-2 text-white">
//           Current Balance: <span className="text-green-300 font-bold">₹{balance}</span>
//         </p>
//       </div>

//       {/* Transaction History */}
//       <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl mt-6 border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
//         <h2 className="text-xl font-semibold text-gradient mb-4">
//           Transaction History
//         </h2>
//         <div className="overflow-auto max-h-80">
//           <table className="w-full text-left border-collapse text-white">
//             <thead>
//               <tr>
//                 <th className="p-2 border-b border-gray-300">Date</th>
//                 <th className="p-2 border-b border-gray-300">Description</th>
//                 <th className="p-2 border-b border-gray-300">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((txn, index) => (
//                 <tr key={index} className="border-b border-gray-300 hover:bg-blue-600 transition-all duration-300">
//                   <td className="p-2">{txn.date}</td>
//                   <td className="p-2">{txn.description}</td>
//                   <td className={`p-2 ${txn.amount > 0 ? 'text-green-300' : 'text-red-300'}`}>
//                     ₹{txn.amount}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Spending Analytics
//       <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl mt-6 border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
//         <h2 className="text-xl font-semibold text-gradient mb-4">
//           Spending Trends
//         </h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={transactions}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" stroke="#ffffff" />
//             <YAxis stroke="#ffffff" />
//             <Tooltip wrapperStyle={{ backgroundColor: '#ffffff', color: '#000000' }} />
//             <Line type="monotone" dataKey="amount" stroke="#ffcc00" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div> */}
//       {/* Spending Analytics */}
//       <div className="p-6 rounded-lg shadow-lg w-full max-w-4xl mt-6 border-2 border-blue-gradient transition-all duration-300 hover:bg-black-gradient">
//         <h2 className="text-xl font-semibold text-gradient mb-4">
//           Spending Trends
//         </h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={transactions.filter(txn => txn.amount < 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" stroke="#ffffff" />
//             <YAxis stroke="#ffffff" domain={["auto", 0]} /> 
//             <Tooltip wrapperStyle={{ backgroundColor: '#ffffff', color: '#000000' }} />
//             <Line type="monotone" dataKey="amount" stroke="#ff4c4c" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// };

// export default Dashboard;
