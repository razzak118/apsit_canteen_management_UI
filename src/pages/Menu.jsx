import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Adjust "SNACK" to match your ItemCategory enum perfectly
                const res = await api.get('/item/category/SNACK'); 
                // Ensure we always set an array, even if the backend returns nothing
                setItems(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to fetch menu", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const addToCart = async (itemId) => {
        if (!itemId) {
            console.error("Item ID is missing!");
            return;
        }
        try {
            await api.post(`/cart/add/${itemId}`);
            alert('Added to cart!');
        } catch (error) {
            console.error("Failed to add", error);
            alert('Failed to add item to cart. Please make sure you are logged in.');
        }
    };

    if (loading) return <div>Loading fresh food...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Canteen Menu</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.length === 0 ? <p>No items found for this category.</p> : null}
                {items.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white">
                        <img 
                            src={item.imageUrl} 
                            alt={item.itemName} 
                            className="w-full h-48 object-cover rounded-md mb-4"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Fallback image
                        />
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{item.itemName}</h2>
                            <span className="text-green-600 font-bold">₹{item.price}</span>
                        </div>
                        <button 
                            onClick={() => addToCart(item.id)}
                            disabled={!item.available}
                            className={`w-full py-2 rounded ${item.available ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {item.available ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}