import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    addOns?: {
        giftCard: boolean;
        customName: string | null;
    };
}

interface Order {
    orderId: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    total: number;
    status: string;
    date: string;
    items: OrderItem[];
}

const AdminDashboard: React.FC = () => {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = getToken();
                const response = await fetch(`${API_BASE_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [getToken]);

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update status');
            }

            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update status');
        }
    };

    if (isLoading) {
        return <div className="text-white text-center p-8">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-red-400 text-center p-8">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-8 text-white h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#C7A07A]">Admin Dashboard</h1>

            <div className="backdrop-blur-md bg-white/5 rounded-xl border border-[#C7A07A]/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#C7A07A]/20 bg-black/20 text-[#C7A07A]">
                                <th className="p-4 font-semibold">Order ID</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Total</th>
                                <th className="p-4 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <React.Fragment key={order.orderId}>
                                    <tr
                                        className="border-b border-[#C7A07A]/10 hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => toggleExpand(order.orderId)}
                                    >
                                        <td className="p-4 font-mono text-sm opacity-80">{order.orderId}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{order.name}</div>
                                            <div className="text-xs opacity-60">{order.email}</div>
                                        </td>
                                        <td className="p-4 text-sm opacity-80">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                className={`px-2 py-1 rounded text-xs font-medium border-none outline-none cursor-pointer ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    order.status === 'Processing' ? 'bg-blue-500/20 text-blue-300' :
                                                        order.status === 'Shipped' ? 'bg-purple-500/20 text-purple-300' :
                                                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                                                                'bg-red-500/20 text-red-300'
                                                    }`}
                                            >
                                                <option value="Pending" className="bg-gray-800 text-yellow-300">Pending</option>
                                                <option value="Processing" className="bg-gray-800 text-blue-300">Processing</option>
                                                <option value="Shipped" className="bg-gray-800 text-purple-300">Shipped</option>
                                                <option value="Delivered" className="bg-gray-800 text-green-300">Delivered</option>
                                                <option value="Cancelled" className="bg-gray-800 text-red-300">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right font-medium text-[#C7A07A]">
                                            LKR {order.total.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-xs opacity-60">
                                                {expandedOrderId === order.orderId ? '▼' : '▶'}
                                            </span>
                                        </td>
                                    </tr>
                                    {expandedOrderId === order.orderId && (
                                        <tr className="bg-black/20">
                                            <td colSpan={6} className="p-4">
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-80 mb-4">
                                                        <div>
                                                            <span className="text-[#C7A07A]">Phone:</span> {order.phone}
                                                        </div>
                                                        <div>
                                                            <span className="text-[#C7A07A]">Address:</span> {order.address}
                                                        </div>
                                                    </div>

                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="text-xs uppercase opacity-50 border-b border-white/10">
                                                                <th className="py-2 text-left">Item</th>
                                                                <th className="py-2 text-center">Qty</th>
                                                                <th className="py-2 text-right">Price</th>
                                                                <th className="py-2 text-right">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items.map((item, idx) => (
                                                                <tr key={idx} className="border-b border-white/5 last:border-0">
                                                                    <td className="py-2">
                                                                        <div className="font-medium">{item.name}</div>
                                                                        {item.addOns?.customName && (
                                                                            <div className="text-xs opacity-60">Custom Name: {item.addOns.customName}</div>
                                                                        )}
                                                                        {item.addOns?.giftCard && (
                                                                            <div className="text-xs opacity-60">Gift Card Included</div>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 text-center">{item.quantity}</td>
                                                                    <td className="py-2 text-right">LKR {item.price.toLocaleString()}</td>
                                                                    <td className="py-2 text-right">LKR {item.totalPrice.toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
