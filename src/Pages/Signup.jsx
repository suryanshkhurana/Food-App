import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

const Signup = () => {
    const [fullname, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const response = await api.post("/users/register", {
                fullname,
                email,
                password
            });
            
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="mt-20 flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
            <p className="text-2xl font-medium m-auto">
                <span className="text-indigo-500">User</span> Sign Up
            </p>
            
            {error && (
                <div className="w-full p-2 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}
            
            <div className="w-full">
                <p>Name</p>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={fullname} 
                    placeholder="type here" 
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" 
                    type="text" 
                    required 
                />
            </div>
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
                Already have account? <span onClick={() => navigate("/login")} className="text-indigo-500 cursor-pointer">click here</span>
            </p>
            <button 
                type="submit"
                disabled={loading}
                className={`${loading ? "bg-indigo-300" : "bg-indigo-500 hover:bg-indigo-600"} transition-all text-white w-full py-2 rounded-md cursor-pointer`}
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>
        </form>
    );
};

export default Signup;