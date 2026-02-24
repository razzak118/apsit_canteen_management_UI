import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { KeyRound } from 'lucide-react';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if(newPassword==oldPassword){
            setError('new password is same as previous one!');
            return;
        }

        try {
            // NOTE: Ensure this matches your backend API endpoint and request body format
            await api.post('/auth/change-password', {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
            
            setSuccess('Password changed successfully! Redirecting...');
            setTimeout(() => {
                navigate('/'); // Go back to home after success
            }, 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password. Please check your old password.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                    <KeyRound size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium border border-green-100">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Old Password</label>
                    <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                    <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                    />
                </div>
                
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-6 shadow-md"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
}