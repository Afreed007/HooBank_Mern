import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountNumber, setAccountNumber] = useState(""); 
  const [debitPin, setDebitPin] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api/auth";

  // Clear form and errors when switching between login/signup
  useEffect(() => {
    setError("");
    setEmail("");
    setPassword("");
    setAccountNumber("");
    setDebitPin("");
  }, [isSignup]);

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!accountNumber.trim() || !debitPin.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          accountNumber: accountNumber.trim(), 
          debitPin: debitPin.trim(), 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user data
        localStorage.setItem('bankingToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        alert("✅ Signup successful! Welcome to your banking dashboard.");
        onClose();
        navigate("/dashboard", {
          state: { 
            user: data.user,
            transactions: data.user.transactions || [] 
          },
        });
      } else {
        setError(data.msg || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user data
        localStorage.setItem('bankingToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        alert("✅ Login Successful! Welcome back.");
        onClose();
        navigate("/dashboard", {
          state: { 
            user: data.user,
            transactions: data.user.transactions || [] 
          },
        });
      } else {
        setError(data.msg || "Invalid credentials");
        
        // If email doesn't exist, suggest signup
        if (data.redirectToSignup) {
          setTimeout(() => {
            setIsSignup(true);
            setError("Account not found. Please sign up below.");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-primary p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gradient mb-6">
          {isSignup ? "Create Bank Account Access" : "Login to Your Account"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <>
              <div>
                <label className="block text-white font-medium">Bank Account Number</label>
                <input
                  type="text"
                  placeholder="Enter your 10-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                  maxLength="15"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-300 mt-1">Use your official bank account number</p>
              </div>

              <div>
                <label className="block text-white font-medium">Debit Card PIN</label>
                <input
                  type="password"
                  placeholder="Enter your 4-digit PIN"
                  value={debitPin}
                  onChange={(e) => setDebitPin(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                  maxLength="4"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-300 mt-1">Enter the PIN associated with your debit card</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-white font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              placeholder={isSignup ? "Create a strong password (min 6 chars)" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              minLength={isSignup ? "6" : undefined}
              required
              disabled={loading}
            />
            {isSignup && (
              <p className="text-xs text-gray-300 mt-1">Choose a secure password for your online banking</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-primary bg-blue-gradient rounded-lg text-lg font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignup ? "Creating Account..." : "Signing In..."}
              </span>
            ) : (
              isSignup ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        {/* Toggle between Login & Signup */}
        <p className="text-center text-white mt-4">
          {isSignup ? "Already registered with us?" : "Need to register your account?"}{" "}
          <span
            className="text-blue-300 cursor-pointer hover:underline"
            onClick={() => !loading && setIsSignup(!isSignup)}
          >
            {isSignup ? "Sign In Here" : "Register Now"}
          </span>
        </p>

        {/* Sample Account Info for Testing */}
        <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg">
          <p className="text-xs text-gray-300 text-center">
            <strong>Demo Account:</strong> Account: 1234567890 | PIN: 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;




















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginModal = ({ isOpen, onClose }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [accountNumber, setAccountNumber] = useState(""); 
//   const [debitPin, setDebitPin] = useState(""); 

//   const navigate = useNavigate();

//   const API_BASE = "http://localhost:5000/api/auth"; // Update this based on your backend port

//   // Handle Signup (calls backend)
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_BASE}/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ accountNumber, debitPin, email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("✅ Signup successful! Please login.");
//         setIsSignup(false);
//         setEmail("");
//         setPassword("");
//         setAccountNumber("");
//         setDebitPin("");
//       } else {
//         alert(`❌ ${data.msg || "Signup failed."}`);
//       }
//     } catch (error) {
//       console.error("Signup Error:", error);
//       alert("❌ Server Error. Please try again later.");
//     }
//   };

//   // Handle Login (calls backend)
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_BASE}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("✅ Login Successful!");
//         navigate("/dashboard", {
//           state: { transactions: data.transactions || [] },
//         });
//       } else {
//         alert(`❌ ${data.msg || "Invalid Email or Password."}`);
//       }
//     } catch (error) {
//       console.error("Login Error:", error);
//       alert("❌ Server Error. Please try again later.");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
//       <div className="bg-primary p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        
//         {/* Close Button */}
//         <button
//           className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
//           onClick={onClose}
//         >
//           ✕
//         </button>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-center text-gradient mb-6">
//           {isSignup ? "Create an Account" : "Login to Your Account"}
//         </h2>

//         {/* Form */}
//         <form className="space-y-4" onSubmit={isSignup ? handleSignup : handleLogin}>
//           {isSignup && (
//             <>
//               <div>
//                 <label className="block text-white font-medium">Account Number</label>
//                 <input
//                   type="text"
//                   placeholder="Enter your account number"
//                   value={accountNumber}
//                   onChange={(e) => setAccountNumber(e.target.value)}
//                   className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-white font-medium">Debit Card PIN</label>
//                 <input
//                   type="password"
//                   placeholder="Enter your debit card PIN"
//                   value={debitPin}
//                   onChange={(e) => setDebitPin(e.target.value)}
//                   className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//                   required
//                 />
//               </div>
//             </>
//           )}

//           <div>
//             <label className="block text-white font-medium">Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-white font-medium">Password</label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 text-primary bg-blue-gradient rounded-lg text-lg font-semibold shadow-md hover:opacity-90 transition-all"
//           >
//             {isSignup ? "Sign Up" : "Login"}
//           </button>
//         </form>

//         {/* Toggle between Login & Signup */}
//         <p className="text-center text-white mt-4">
//           {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//           <span
//             className="text-blue-300 cursor-pointer hover:underline"
//             onClick={() => setIsSignup(!isSignup)}
//           >
//             {isSignup ? "Login" : "Sign Up"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;