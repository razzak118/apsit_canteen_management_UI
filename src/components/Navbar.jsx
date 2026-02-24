import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, LogOut, Utensils, User, Settings } from 'lucide-react';
import api from '../api/axiosConfig'; // Important: Import your API config

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // State to manage dropdown visibility and profile image
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close the dropdown if the user clicks anywhere outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch the user's profile image from the backend
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.userId) {
                try {
                    // NOTE: Adjust this endpoint ('/users/...') to match your actual Spring Boot API route
                    const response = await api.get(`/users`);
                    
                    // NOTE: Adjust 'response.data.profileImageUrl' based on your backend response JSON
                    if (response.data && response.data.profilePictureUrl) {
                        setProfileImage(response.data.profilePictureUrl);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile image:", error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

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
                    <Link to="/cart" className="flex items-center gap-1 hover:text-blue-200 transition">
                        <ShoppingCart size={20} />
                        Cart
                    </Link>

                    {/* Profile Picture & Dropdown Menu */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none"
                        >
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold overflow-hidden border-2 border-white">
                                {profileImage ? (
                                    <img 
                                        src={profileImage} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">{user.username}</span>
                        </button>

                        {/* Dropdown Box */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 text-gray-700 border border-gray-100">
                                <Link 
                                    to="/change-password"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    <Settings size={16} className="text-gray-500" />
                                    Change Password
                                </Link>
                                <hr className="border-gray-100" />
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition w-full text-left text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}