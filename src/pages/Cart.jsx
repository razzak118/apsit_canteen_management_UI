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
            console.log(res);
        } catch (error) {
            console.error("Failed to load cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Function to handle quantity increments/decrements
    // FIX: Takes menuItemId because backend searches the menuItem repository
    const updateQuantity = async (menuItemId, change) => {
        try {
            if (change === 1) {
                // FIX: Matches @PostMapping("/addToCart/{itemId}")
                await api.post(`/cart/addToCart/${menuItemId}`);
                window.dispatchEvent(new Event('cartUpdated'));
            } else if (change === -1) {
                // FIX: Matches @PostMapping("/remove/{itemId}")
                await api.post(`/cart/remove/${menuItemId}`);
                window.dispatchEvent(new Event('cartUpdated'));
            }
            fetchCart(); // Refresh cart to get updated totals
        } catch (error) {
            console.error("Failed to update quantity", error);
            alert(error.response?.data?.message || "Could not update quantity.");
        }
    };

    // Function to completely remove an item
    // This correctly takes cartItemId because backend service uses: cartItem.getCartItemId().equals(itemId)
    const removeItem = async (cartItemId) => {
        try {
            // FIX: Changed to POST and matched backend endpoint exactly
            await api.post(`/cart/deleteItemfromCart/${cartItemId}`);
            window.dispatchEvent(new Event('cartUpdated'));
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Failed to remove item", error);
            alert("Could not remove item from cart.");
        }
    };

    const placeOrder = async () => {
        try {
            const res = await api.post('/order/place');
            alert(`Order Placed Successfully!`);
            window.dispatchEvent(new Event('cartUpdated'));
            navigate('/'); 
        } catch (error) {
            alert(error.response?.data?.message || "Failed to place order");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
    
    if (!cart) return <div className="p-8 text-center text-gray-500">Please log in to view your cart.</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Tray</h1>
            
            {!cart.cartItems || cart.cartItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500 text-lg">Your tray is empty. Go find some delicious snacks!</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {cart.cartItems.map(item => {
                        const currentQty = item.cartItemQuantity || item.quantity || 1;
                        
                        return (
                            <div key={item.cartItemId} className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-700 py-6 gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-20 h-20 bg-mint-50 dark:bg-slate-700 text-mint-500 rounded-2xl flex items-center justify-center text-xs font-semibold overflow-hidden shadow-inner">
                                        {item.menuItem.imageUrl ? (
                                            <img src={item.menuItem.imageUrl} alt="food" className="object-cover w-full h-full" />
                                        ) : (
                                            "Food"
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                                            {item.menuItem?.itemName || 'Unknown Item'}
                                        </h3>
                                        <span className="text-mint-600 dark:text-mint-400 font-bold block sm:hidden">
                                            ₹{item.cartItemPrice || 0}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Controls area */}
                                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                                    <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-700">
                                        <button 
                                            onClick={() => updateQuantity(item.menuItem.itemId, -1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 hover:text-accent-500 transition"
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center font-bold text-slate-800 dark:text-slate-100">
                                            {currentQty}
                                        </span>
                                        <button 
                                            onClick={() => updateQuantity(item.menuItem.itemId, 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 hover:text-accent-500 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <div className="text-right flex items-center gap-4">
                                        <span className="font-black text-mint-600 dark:text-mint-400 hidden sm:block text-xl">
                                            ₹{item.cartItemPrice || 0}
                                        </span>
                                        <button 
                                            onClick={() => removeItem(item.cartItemId)}
                                            className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-slate-700 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700 text-xl">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">Total Amount:</span>
                        <span className="font-black text-mint-600 dark:text-mint-400 text-3xl">₹{cart.totalCartPrice || 0}</span>
                    </div>
                    
                    <button 
                        onClick={placeOrder}
                        className="w-full mt-8 bg-mint-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-mint-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                    >
                        Place Order (Pay at Counter)
                    </button>
                </div>
            )}
        </div>
    );
}