import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate();
  const [shopnumber, setShopnumber] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault();
    
    setError("");

    if (!shopnumber.trim()) {
      setError("Please enter a shop number");
      return;
    }

    if (token) {
     navigate("/result")
    }

    setLoading(true);

    try {
      navigate("/otp" , {
        state:{shopnumber}
      } )
    } catch{console.error}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-blue-900/30 backdrop-blur">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-blue-300">Arora Portal</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">
            Search Shop Details
          </h2>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            value={shopnumber}
            onChange={(e) => setShopnumber(e.target.value)}
            placeholder="Enter shop number"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-rose-400">{error}</p>
        )}
      </div>
    </div>
  );
}
