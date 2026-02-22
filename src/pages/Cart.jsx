import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart/my-cart');
            setCart(res.data);
        } catch (error) {
            console.error("Failed to load cart", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const placeOrder = async () => {
        try {
            const res = await api.post('/order/place');
            alert(`Order Placed Successfully! Order Status: ${res.data.orderStatus}`);
            navigate('/orders'); // Redirect to an order history page
        } catch (error) {
            alert(error.response?.data?.message || "Failed to place order");
        }
    };

    if (!cart) return <div>Loading cart...</div>;

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Your Tray</h1>
            
            {cart.cartItems?.length === 0 ? (
                <p className="text-gray-500">Your cart is empty. Go find some snacks!</p>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    {cart.cartItems.map(item => (
                        <div key={item.cartItemId} className="flex justify-between items-center border-b py-4">
                            <div className="flex items-center gap-4">
                                <img src={item.cartItemImageUrl} className="w-16 h-16 rounded object-cover" />
                                <div>
                                    <h3 className="font-semibold">{item.menuItem.itemName}</h3>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-bold">₹{item.cartItemPrice}</span>
                        </div>
                    ))}
                    
                    <div className="flex justify-between items-center mt-6 text-xl">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-green-600">₹{cart.totalCartPrice}</span>
                    </div>
                    
                    <button 
                        onClick={placeOrder}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                    >
                        Place Order (Pay at Counter)
                    </button>
                </div>
            )}
        </div>
    );
}