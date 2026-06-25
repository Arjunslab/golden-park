import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [shopnumber, setShopnumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!shopnumber.trim()) {
      setError("Please enter your shop number");
      return;
    }

    setLoading(true);

    // try {
    //   const response = await fetch(`${API_URL}/api/auth/verify-admin`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ shopnumber: shopnumber.trim() }),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || "Access denied");
    //   }

    //   localStorage.setItem("adminAuth", "true");
    //   navigate("/admin");
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-cyan-900/20">
        <div className="mb-6 text-center">
          <p className="text-sm text-cyan-300">Admin Access</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={shopnumber}
            onChange={(e) => setShopnumber(e.target.value)}
            placeholder="Enter admin shop number"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-rose-400">{error}</p>
        )}
      </div>
    </div>
  );
}
