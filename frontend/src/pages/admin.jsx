import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      if (!token) {
        navigate("/notfound");
        return;
      }

      try {
        const verifyResponse = await API.post("/api/auth/verify-admin", {
          token,
        });

        if (!verifyResponse.data?.message) {
          navigate("/notfound");
          return;
        }

        const recordsResponse = await API.get("/api/auth/all-records");
        setRecords(recordsResponse.data?.data || []);
      } catch (err) {
        console.error("Admin load error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load records",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-300">Admin Portal</p>
            <h2 className="text-3xl font-semibold">Shop Records</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
            >
              Back to Search
            </button>
          </div>
        </div>

        {loading && <p>Loading records...</p>}
        {error && <p className="text-rose-400">{error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Shop No.</th>
                  <th className="px-4 py-3 text-left text-sm">Role</th>
                  <th className="px-4 py-3 text-left text-sm">Total</th>
                  <th className="px-4 py-3 text-left text-sm">Remaining</th>
                  <th className="px-4 py-3 text-left text-sm">Installments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-4 py-3">{record.shopnumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          record.role === "Admin"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-blue-500/15 text-blue-300"
                        }`}
                      >
                        {record.role || "Shop Owner"}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{record.totalAmount}</td>
                    <td className="px-4 py-3">₹{record.remainingAmount}</td>
                    <td className="px-4 py-3">
                      {record.installments?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
