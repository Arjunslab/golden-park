import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useState, useEffect } from "react";

export default function VerifyLink() {
    const [searchParams] = useSearchParams();
    const Navigate = useNavigate()
    const verificationToken = searchParams.get("token");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const redirect = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    useEffect(() => {
        const verify = async () => {
            if (!verificationToken) {
                setMessage("Invalid verification link.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await API.post("api/auth/verify-link", { verificationToken });
                setMessage(res.data.message || "Email verified successfully!");
                   localStorage.setItem(
        "token",
        res.data.token

      );

      redirect(2000)
      Navigate("/result")

            } catch (err) {
                console.error(err);
                setMessage(err.response?.data?.error || "Failed to verify link");
            } finally {
                setLoading(false);

                 
            }
        };
        verify();
    }, [verificationToken]);

    if (loading) {
        return <div className="flex dark:bg-gray-900 bg-blue-100 flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

     return (
        <div className="flex flex-col dark:bg-gray-900 bg-blue-100 items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold dark:text-white text-gray-700">{message}</h1>
            <p className="text-lg dark:text-white text-gray-700">{}</p>
        </div>
    );
}
    
