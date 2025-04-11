import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const navigate = useNavigate();
    const loginUser = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/login", {
                email,
                password,
            }, {
                withCredentials: true // Important to include cookies
            });

            console.log("Login successful:", response.data);
            loginUser(response.data.data.user); 
            
            // Navigate to home page after login
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="mt-20 flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
            <p className="text-2xl font-medium m-auto">
                <span className="text-indigo-500">User</span> Login
            </p>

            {error && (
                <p className="text-red-500 text-sm w-full text-center">{error}</p>
            )}

            <div className="w-full">
                <p>Email</p>
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    placeholder="type here" 
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" 
                    type="email" 
                    required 
                />
            </div>
            <div className="w-full">
                <p>Password</p>
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    placeholder="type here" 
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" 
                    type="password" 
                    required 
                />
            </div>
            <p>
                Create an account?{" "}
                <span onClick={() => navigate("/signup")} className="text-indigo-500 cursor-pointer">
                    click here
                </span>
            </p>
            <button 
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
            >
                Login
            </button>
        </form>
    );
};

export default Login;