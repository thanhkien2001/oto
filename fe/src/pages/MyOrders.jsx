import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('/orders')
                .then(res => setOrders(res.data))
                .catch(err => console.error("Failed to fetch orders", err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning">
                    Vui lòng <Link to="/login">đăng nhập</Link> để xem đơn hàng của bạn.
                </div>
            </div>
        );
    }

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Chờ xác nhận': return <span className="badge bg-warning text-dark">Chờ xác nhận</span>;
            case 'Đã giao': return <span className="badge bg-success">Đã giao</span>;
            case 'Đã hủy': return <span className="badge bg-danger">Đã hủy</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-file-text text-primary"></i> Đơn hàng của tôi
            </h2>

            {orders.length === 0 ? (
                <div className="alert alert-info text-center py-5">
                    <i className="bi bi-cart-x display-4 mb-3 d-block text-muted"></i>
                    <p className="lead mb-3">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="btn btn-primary rounded-pill px-4">Mua sắm ngay</Link>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded bg-white">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 px-4">Mã đơn hàng</th>
                                <th className="py-3 px-4">Ngày đặt</th>
                                <th className="py-3 px-4">Tổng tiền</th>
                                <th className="py-3 px-4">Trạng thái</th>
                                <th className="py-3 px-4 text-end">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-4 fw-bold">#{order.id}</td>
                                    <td className="px-4">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 text-danger fw-bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                    </td>
                                    <td className="px-4">{getStatusBadge(order.status)}</td>
                                    <td className="px-4 text-end">
                                        <Link to={`/my-orders/${order.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                                            Xem <i className="bi bi-arrow-right ms-1"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
