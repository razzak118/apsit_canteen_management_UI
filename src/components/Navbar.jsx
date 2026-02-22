import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, LogOut, Utensils } from 'lucide-react'; // Make sure you installed lucide-react

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // If the user isn't logged in, don't show the navbar
    if (!user) return null;

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    <Utensils size={24} />
                    APSIT Canteen
                </Link>
                
                <div className="flex items-center gap-6">
                    <span className="text-sm opacity-80">Hello, {user.username}</span>
                    <Link to="/cart" className="flex items-center gap-1 hover:text-blue-200 transition">
                        <ShoppingCart size={20} />
                        Cart
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-1 hover:text-red-200 transition"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}