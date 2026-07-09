import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import Signup from "./pages/signup";
import Result from "./pages/result";
import Admin from "./pages/admin";
import AddNew from "./pages/add_new.jsx";
import NotFound from "./pages/404.jsx";
import OTP from "./pages/otp.jsx";
import VerifyLink from "./pages/verify-link.jsx";



function App() {


  return (
    <>
    <Toaster
  
  toastOptions={{
    style: {
      background: "#0f172a", // slate-900
      color: "#fff",
      border: "1px solid #334155",
    },
    success: {
      iconTheme: {
        primary: "#06b6d4",
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>

    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add_new" element={<AddNew />} />
        <Route path="/otp" element={<OTP />} />    
        <Route path="/verify-email" element={<VerifyLink />} />
        <Route path="/*"  element={<NotFound />} />
     
      </Routes>
    </Router>
    </>
  );
}

export default App;
