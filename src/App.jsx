import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';

// Components & Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import ChangePassword from './pages/ChangePassword'; // <-- Import the new page

// A quick wrapper component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
                    <Toaster position="bottom-right" reverseOrder={false} />
                    <Navbar />
                    <main className="container mx-auto py-6">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            
                            {/* Protected Routes */}
                            <Route 
                                path="/" 
                                element={
                                    <ProtectedRoute>
                                        <Menu />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/cart" 
                                element={
                                    <ProtectedRoute>
                                        <Cart />
                                    </ProtectedRoute>
                                } 
                            />
                            {/* New Protected Route for changing password */}
                            <Route 
                                path="/change-password" 
                                element={
                                    <ProtectedRoute>
                                        <ChangePassword />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}