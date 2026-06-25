import { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import API from "../api/axios.js";

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    function logout() {
      console.log("function logout caled");
        localStorage.removeItem("token");
        navigate("/", { replace : true});
    }


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;

      
    }
  


    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/auth/records");
        setResult(res.data.data || null);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError("Unable to load result.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <p className="text-white">Loading result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          <h3 className="text-2xl font-semibold text-white">
            {error || "No data found"}
          </h3>
          <button
            onClick={logout}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
  
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => logout()}
          className="mb-4 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          ← Back
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-blue-900/20">
          <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-5">
            <h2 className="text-2xl font-semibold text-white">Shop Details</h2>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Shop Number</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {result.shopnumber}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Total Amount</p>
              <p className="mt-1 text-xl font-semibold text-emerald-400">
                ₹{result.totalAmount}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Remaining Amount</p>
              <p className="mt-1 text-xl font-semibold text-rose-400">
                ₹{result.remainingAmount}
              </p>
            </div>
          </div>

          





















          

          <div className="px-6 pb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              Installment History
            </h3>
            <div className="rounded-xl border border-slate-800 bg-slate-950">
              {result.installments?.length > 0 ? (
                <ul className="divide-y divide-slate-800">
                  {result.installments.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-4 py-3 text-sm text-slate-200"
                    >
                      <span>₹{item.amount}</span>
                      <span>{new Date(item.paidAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm text-slate-400">
                  No installments yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
