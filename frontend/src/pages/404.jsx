import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center shadow-2xl shadow-blue-900/20">

        <div className="mb-6">
          <h1 className="text-8xl font-black text-cyan-400">
            404
          </h1>
          <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
        </div>

        <h2 className="mb-3 text-3xl font-bold text-white">
          Page Not Found
        </h2>

        <p className="mb-8 text-slate-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-500">
            Error Code: <span className="text-rose-400">404_NOT_FOUND</span>
          </p>
        </div>
      </div>
    </div>
  );
}