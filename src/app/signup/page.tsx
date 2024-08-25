"use client";

import { useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState('');

    const handleSignUp = async() => {
        try{
            const result = await createUserWithEmailAndPassword(auth, email, password)
            console.log(result);
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            handleNavigate()
        }catch(error: any){
            console.error("Something Went Wrong!", error)
        }
    }

    const signup = async() => {
        if(password !== confirmPassword){
            setError("Confirm Password Doesn't Match With Password!")
            return
        }
        await handleSignUp()
    }

    const handleNavigate = () => {
        router.push("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                    onClick={signup}
                        disabled={!email || !password || !confirmPassword}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Sign Up
                    </button>
                    <div>
                        <button onClick={handleNavigate} className="text-gray-700 hover:text-sky-600">Already a member?</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup