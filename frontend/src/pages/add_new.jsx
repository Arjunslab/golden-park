  import API from "../api/axios";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

  function AddNew() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      try {
        if (!token) {
          navigate("/notfound");
          return;
        }

        const response = await API.post("/api/auth/verify-admin", {
          token,
        });

        console.log(response.data);

        if (!response.data.message) {
          navigate("/notfound");
        }
      } catch (err) {
        console.error(err);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    }

    verifyAdmin();
  }, [token, navigate]);






    useEffect(() => {
      if (!token) {
        navigate("/notfound");
      }
    }, [token, navigate]);

    const [shopnumber, setShopnumber] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    // const [unverifiedphone, setunverifiedphone] = useState("")
    const [role, setrole] = useState("")
    const [area, setArea] = useState("");
    const [maintenance, setMaintenance] = useState("");


    const handleSubmit = async (e) => {
      e.preventDefault();
      // const regex = /^\d{10}$/;
      // setIsValid(regex.test(unverifiedphone));
      // setPhone();

      if (!token) {
        navigate("/notfound");
        return;
      }

      try {
        const res = await API.post("api/auth/new", {
          shopnumber,
          name,
          email,
          phone,
          area,
          maintenance,
          token,
          role,
        });

        alert( JSON.stringify(res.data || res));
      } catch (error) {
        alert(
          "Something went wrong while submitting the form: " +
            (error.response?.data?.message || error.message),
        );
      }
    };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl shadow-cyan-900/20">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

          <h1 className="mt-5 text-2xl font-bold text-white">
            Checking Permissions
          </h1>

          <p className="mt-2 text-slate-400">
            Validating your session and admin access...
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-full animate-pulse rounded-full bg-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

    return(
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-blue-900/20">
            <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-5">
              <h2 className="text-2xl font-semibold text-white">
                Add New Record
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Enter shop owner and maintenance details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Shop Number
                </label>
                <input
                  type="text"
                  name="shopnumber"
                  value={shopnumber}
                  onChange={(e) => setShopnumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Owner Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Owner Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Shop Area (sq ft)
                </label>
                <input
                  type="text"
                  name="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Maintenance Amount
                </label>
                <input
                  type="number"
                  name="maintenance"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                Role
                </label>
                <select
                  type="email"
                  name="email"
                  value={role}
                  
                  onChange={(e) => setrole(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                >
                  <option value="Shop Owner" >Shop Owner</option>
                  <option value="Admin" >admin</option>
                  
                  </select>

              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Add Record
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default AddNew;
