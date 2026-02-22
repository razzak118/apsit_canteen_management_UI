import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart/my-cart');
            setCart(res.data);
        } catch (error) {
            console.error("Failed to load cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const placeOrder = async () => {
        try {
            const res = await api.post('/order/place');
            alert(`Order Placed Successfully!`);
            // Clear cart or redirect
            navigate('/'); 
        } catch (error) {
            alert(error.response?.data?.message || "Failed to place order");
        }
    };

    if (loading) return <div>Loading cart...</div>;
    if (!cart) return <div className="p-8">Please log in to view your cart.</div>;

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Your Tray</h1>
            
            {!cart.cartItems || cart.cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty. Go find some snacks!</p>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    {cart.cartItems.map(item => (
                        <div key={item.cartItemId} className="flex justify-between items-center border-b py-4">
                            <div className="flex items-center gap-4">
                                {/* Use fallback image if empty */}
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">Food</div>
                                <div>
                                    <h3 className="font-semibold">{item.menuItem?.itemName || 'Unknown Item'}</h3>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity || 1}</p>
                                </div>
                            </div>
                            <span className="font-bold">₹{item.cartItemPrice || 0}</span>
                        </div>
                    ))}
                    
                    <div className="flex justify-between items-center mt-6 text-xl">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-green-600">₹{cart.totalCartPrice || 0}</span>
                    </div>
                    
                    <button 
                        onClick={placeOrder}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-200"
                    >
                        Place Order (Pay at Counter)
                    </button>
                </div>
            )}
        </div>
    );
}