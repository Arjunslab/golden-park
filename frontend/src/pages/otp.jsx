import { useEffect, useState } from "react";
import { redirect, useLocation} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function OTP() {
  const location  = useLocation();
  const shopnumber = location?.state?.shopnumber;
  const Navigate = useNavigate()
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  // const [error, setError] = useState("");

console.log(location);
console.log(location.state);

  useEffect(() => {
    sendOTP();
  }, []);

  async function sendOTP() {
    setSending(true);
    // setError("");

    try {

if (!shopnumber) {
  toast.error("Please retry");
  navigate("/");
  return;
}
      const res = await API.post("/api/auth/send-otp", {
        shopnumber,
      });

      localStorage.setItem("token", res.data.token);
     if (res.data.success) {
      toast.success("OTP sent")
     }
    } catch (err) {
      toast.error("Unable to send OTP.")
    }

    setSending(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    // setError("");

    try {
   const token = localStorage.getItem("token")

      const res = await API.post("/api/auth/verify-otp", {
        otp,
        token,
      });
      localStorage.setItem("token" , res.data.token)
      toast.success("Verification Success")
      Navigate("/result")

      // toast.success("OTP sent.")
    } catch (err) {
      toast.error("Invalid OTP")
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 px-4 py-16 flex items-center justify-center">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-blue-900/30 backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-blue-300">
            Arora Portal
          </p>

          <h2 className="mt-1 text-3xl font-semibold text-white">
            Verify OTP
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            We've sent a verification code for shop{" "}
            <span className="font-semibold text-cyan-400">
              {shopnumber}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter OTP"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={sendOTP}
          disabled={sending}
          className="mt-5 w-full text-sm text-cyan-400 transition hover:text-cyan-300 disabled:opacity-60"
        >
          {sending ? "Sending OTP..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}