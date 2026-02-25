import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Clock, Zap} from 'lucide-react';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    
    // Make sure these match the exact spelling of your Spring Boot ItemCategory enum
    const categories = ['ALL', 'SNACK', 'BEVERAGE', 'VEG', 'INSTANT'];

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                let res;
                if (selectedCategory === 'ALL') {
                    // Adjust this endpoint if your backend uses just '/item' instead of '/item/all'
                    res = await api.get('/item');
                }else if(selectedCategory==='INSTANT'){
                    res=await api.get('/item/instant-ready')
                }
                else {
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

                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                selectedCategory === category
                                    ? 'bg-mint-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-mint-300 hover:bg-mint-50 dark:hover:bg-slate-700'
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
                            <div key={item.itemId} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700 m-2 rounded-2xl">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.itemName} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'; }} 
                                    />
                                    {!item.available && (
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-bold px-4 py-2 bg-slate-800/80 rounded-full text-sm">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    {/* Title and Price Row */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight pr-2">
                                            {item.itemName}
                                        </h2>
                                        <span className="text-lg font-black text-mint-600 dark:text-mint-400 shrink-0">
                                            ₹{item.price}
                                        </span>
                                    </div>

                                    {/* ✨ UPDATED: Prep Time Badge with "Instant" logic */}
                                    <div className="flex items-center mb-3">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50">
                                            {item.readyIn === 0 || item.readyIn === '0' ? (
                                                <>
                                                    <Zap size={14} className="text-accent-500 dark:text-accent-400 fill-accent-500/20" />
                                                    <span className="text-xs font-bold text-accent-600 dark:text-accent-400 tracking-wide uppercase">
                                                        Instant
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={14} className="text-accent-500 dark:text-accent-400" />
                                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
                                                        {item.readyIn || 'few'} mins
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}

                                    {/* Add to Cart Button */}
                                    <div className="mt-auto pt-4">
                                        <button 
                                            onClick={() => addToCart(item.itemId)}
                                            disabled={!item.available}
                                            className={`w-full py-3 rounded-xl font-bold tracking-wide transition-all duration-200 ${
                                                item.available 
                                                ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)]' 
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
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