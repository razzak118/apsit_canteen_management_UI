import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // You might need an endpoint in ItemController to fetch ALL items. 
        // For now, let's assume we fetch a specific category or you create a getAll endpoint.
        const fetchItems = async () => {
            try {
                // Hitting your category endpoint for snacks as an example
                const res = await api.get('/item/category/SNACK'); 
                setItems(res.data);
            } catch (error) {
                console.error("Failed to fetch menu", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const addToCart = async (itemId) => {
        try {
            await api.post(`/cart/add/${itemId}`);
            alert('Added to cart!'); // Replace with a nice toast notification later
        } catch (error) {
            console.error("Failed to add", error);
        }
    };

    if (loading) return <div>Loading fresh food...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Canteen Menu</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.itemId} className="border rounded-lg p-4 shadow-sm bg-white">
                        <img 
                            src={item.imageUrl} 
                            alt={item.itemName} 
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{item.itemName}</h2>
                            <span className="text-green-600 font-bold">₹{item.price}</span>
                        </div>
                        <button 
                            onClick={() => addToCart(item.itemId)}
                            disabled={!item.isAvailable}
                            className={`w-full py-2 rounded ${item.isAvailable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}