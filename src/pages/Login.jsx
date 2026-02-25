import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Utensils } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[2rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-mint-50 dark:bg-slate-700 p-4 rounded-full mb-4 text-mint-500 shadow-sm">
                        <Utensils size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">APSIT Canteen</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Sign in to order your food</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input 
                            id="username"
                            type="text" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all dark:text-white"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-mint-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-mint-700 focus:ring-4 focus:ring-mint-200 dark:focus:ring-mint-900 transition-all duration-200 mt-8 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}