import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    
    // Make sure these match the exact spelling of your Spring Boot ItemCategory enum
    const categories = ['ALL', 'SNACK', 'BEVERAGE', 'VEG'];

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                let res;
                if (selectedCategory === 'ALL') {
                    // Adjust this endpoint if your backend uses just '/item' instead of '/item/all'
                    res = await api.get('/item');
                    console.log(res) 
                } else {
                    res = await api.get(`/item/category/${selectedCategory}`);
                }
                
                // Ensure we always set an array
                setItems(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to fetch menu", error);
                setItems([]); // Fallback to empty on error
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [selectedCategory]); // Re-run this effect whenever selectedCategory changes

    const addToCart = async (itemId) => {
        if (!itemId) {
            console.error("Item ID is missing!");
            return;
        }
        try {
            await api.post(`/cart/addToCart/${itemId}`);
            alert('Added to cart!');
        } catch (error) {
            console.error("Failed to add to cart", error);
            // Provide a clearer error message based on backend response if available
            const errorMsg = error.response?.data?.message || 'Failed to add item to cart. Make sure you are logged in.';
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Canteen Menu</h1>
                        <p className="text-gray-500">Discover and order your favorite meals</p>
                    </div>
                </div>

                {/* Category Filter Options */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            {category.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Menu Items Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                                <p className="text-gray-500 text-lg">No items found for this category.</p>
                            </div>
                        ) : null}
                        
                        {items.map((item) => (
                            <div key={item.itemId} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.itemName} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { 
                                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'; 
                                        }} 
                                    />
                                    {!item.available && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-bold px-3 py-1 bg-red-500 rounded-md">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{item.itemName}</h2>
                                        <span className="text-lg font-black text-green-600">₹{item.price}</span>
                                    </div>
                                    {item.description && (
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    )}
                                    <div className="mt-auto pt-4">
                                        <button 
                                            onClick={() => addToCart(item.itemId)}
                                            disabled={!item.available}
                                            className={`w-full py-2.5 rounded-lg font-semibold transition-colors duration-200 ${
                                                item.available 
                                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {item.available ? 'Add to Cart' : 'Unavailable'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}