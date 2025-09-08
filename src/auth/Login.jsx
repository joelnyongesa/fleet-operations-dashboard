import React, { useState } from 'react';
import BasiGoFleet from '../assets/basigo-home-page-kenya.jpeg';
import authDecoration from '../assets/auth-decoration.png';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';

function Login({ onLogin }) {
    const [loading, setLoading] = useState(false);
    const email = "example@email.com";
    const password = "FleetD2025@&";
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
                credentials: "include",
            });
            if(response.ok){
                response.json().then((user) => onLogin(user));
                navigate("/");
            }
        }
        catch(err){
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className="relative flex">
        <div className="w-full md:w-1/2">
            <div className='min-h-[100dvh] h-full flex flex-col after:flex-1'>
                <div className="flex-1">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Insert Logo Here */}
                    </div>
                </div>
                <div className='max-w-sm mx-auto w-full px-4 py-8'>
                    <h1 className="text-3xl text-slate-800 font-bold mb-6">Welcome back! ✨</h1>
                    <p className='italic text-slate-500 text-sm mb-6'>Use the provided credentials to sign in</p>
                    {loading ? (
                        <LoadingSpinner text="Logging in..." />
                    ) : (
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="" autoComplete='off' />
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                
                                <input type="email" name="email" id="email" required className="w-full border rounded border-slate-200 text-slate-500 px-2 py-2 focus:outline-none focus:ring-0 focus:border-slate-400" value={email} readOnly/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                                <input type="password" name="password" id="password" required className="w-full border rounded border-slate-200 px-2 py-2 focus:outline-none focus:ring-0 focus:border-slate-400 text-slate-500" value={password} readOnly />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="mr-1">
                                <a href="" className="text-sm underline hover:no-underline">Forgot Password?
                                </a>
                            </div>
                            <button type="submit" className='bg-indigo-500 text-white whitespace-nowrap ml-3 px-3 py-2 rounded hover:bg-indigo-600 hover:cursor-pointer'>Sign In</button>
                        </div>
                    </form>
                    )}
                    <div className="pt-5 mt-6 border-t border-slate-200">
                        <div className="text-sm">
                            Don't have an account?
                            <a href="" className="font-medium text-indigo-500 hover:text-indigo-600 ml-2">Sign Up</a>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2">
                    <img src={BasiGoFleet} alt="Authentication image" className="object-cover object-center w-full h-full" height={1024} width={760} />
                    <img src={authDecoration} alt="" className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" width={218} height={224} />
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default Login;