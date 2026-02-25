import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, LogOut, Utensils, User, Settings, Moon, Sun, Camera } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Check local storage for theme preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
        setIsDark(!isDark);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ... keeping your existing profile image fetch effect ...
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

    // Triggers the hidden file input
    const triggerFileInput = () => {
        setIsDropdownOpen(false); // Close the dropdown when clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handles the file after the user selects it
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file); // Ensure 'image' matches the backend @RequestParam name

        try {
            const response = await api.post('/users/updateProfilePic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            // If backend returns the new URL, update the image immediately
            if (response.data && response.data.profilePictureUrl) {
                setProfileImage(response.data.profilePictureUrl);
            }
            alert('Profile picture updated successfully!');
            
        } catch (error) {
            console.error("Failed to update profile picture", error);
            alert("Could not update profile picture. Please try again.");
        } finally {
            event.target.value = null; // Clear input so the same file can be chosen again
        }
    };
    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 p-4 shadow-sm border-b border-mint-100 dark:border-slate-700 transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold flex items-center gap-2 text-mint-600 dark:text-mint-500">
                    <Utensils size={24} />
                    APSIT Canteen
                </Link>
                
                <div className="flex items-center gap-6">
                    <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/cart" className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-mint-600 dark:hover:text-mint-400 transition">
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">Cart</span>
                    </Link>

                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none"
                        >
                            <div className="w-10 h-10 bg-mint-100 text-mint-600 rounded-full flex items-center justify-center font-bold overflow-hidden border-2 border-white dark:border-slate-700">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>
                            <span className="text-sm font-medium hidden sm:block text-slate-700 dark:text-slate-200">{user.username}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl py-1 z-50 border border-slate-100 dark:border-slate-700">
                                {/* New Update Profile Pic Button */}
                                <button 
                                    onClick={triggerFileInput}
                                    className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition w-full text-left text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    <Camera size={16} className="text-slate-500 dark:text-slate-400" />
                                    Update Profile Pic
                                </button>
                                <Link 
                                    to="/change-password"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    <Settings size={16} className="text-slate-500 dark:text-slate-400" />
                                    Change Password
                                </Link>
                                <hr className="border-slate-100 dark:border-slate-700" />
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-left text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </nav>
    );
}