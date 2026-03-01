import React, { useEffect, useState } from 'react';
import api from '../../api';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, categories: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        // Fetch simple stats (could be separate endpoint, but for now just fetch counts)
        const fetchStats = async () => {
            try {
                const [pRes, cRes, oRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/admin/orders') // Assuming implementation
                ]);
                setStats({
                    products: pRes.data.length,
                    categories: cRes.data.length,
                    orders: oRes.data.length,
                });
                setRecentOrders(oRes.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="mb-4">Admin Dashboard</h2>
            <div className="row g-4 mb-4">
                <div className="col-md-4 col-xl-3">
                    <div className="card bg-primary text-white h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Sản phẩm</h5>
                            <p className="card-text display-6 fw-bold">{stats.products}</p>
                            <i className="bi bi-box-seam position-absolute top-0 end-0 p-3 fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-xl-3">
                    <div className="card bg-success text-white h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Danh mục</h5>
                            <p className="card-text display-6 fw-bold">{stats.categories}</p>
                            <i className="bi bi-tags position-absolute top-0 end-0 p-3 fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-xl-3">
                    <div className="card bg-warning text-white h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Đơn hàng</h5>
                            <p className="card-text display-6 fw-bold">{stats.orders}</p>
                            <i className="bi bi-cart-check position-absolute top-0 end-0 p-3 fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Đơn hàng mới nhất</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="py-3 px-4">Mã ĐH</th>
                                    <th className="py-3 px-4">Khách hàng</th>
                                    <th className="py-3 px-4">Ngày đặt</th>
                                    <th className="py-3 px-4">Tổng tiền</th>
                                    <th className="py-3 px-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 fw-bold">#{order.id}</td>
                                            <td className="px-4">{order.customer_name}</td>
                                            <td className="px-4 text-muted small">{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                                            <td className="px-4 text-danger fw-bold">{new Intl.NumberFormat('vi-VN').format(order.total_amount)} đ</td>
                                            <td className="px-4">
                                                <span className={`badge ${order.status === 'Chờ xác nhận' ? 'bg-warning text-dark' :
                                                    order.status === 'Đã giao' ? 'bg-success' :
                                                        order.status === 'Đã hủy' ? 'bg-danger' : 'bg-primary'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">Chưa có đơn hàng nào.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
