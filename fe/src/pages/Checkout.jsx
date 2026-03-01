import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        notes: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customer_name: user.full_name || '',
                customer_phone: user.phone || '',
                customer_address: user.address || '',
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                ...formData,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            };

            await api.post('/orders', orderData);
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Đặt hàng thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    if (cart.length === 0) return <div className="text-center mt-5">Giỏ hàng trống</div>;

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Thông Tin Thanh Toán</h2>
            <div className="row">
                <div className="col-md-7 mb-4">
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <h4 className="card-title mb-3">Thông tin giao hàng</h4>
                        <div className="mb-3">
                            <label className="form-label">Họ tên người nhận</label>
                            <input type="text" className="form-control" name="customer_name" value={formData.customer_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input type="tel" className="form-control" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ nhận hàng</label>
                            <textarea className="form-control" name="customer_address" rows="3" value={formData.customer_address} onChange={handleChange} required></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ghi chú thêm</label>
                            <textarea className="form-control" name="notes" rows="2" value={formData.notes} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 btn-lg mt-2">Xác nhận đặt hàng</button>
                    </form>
                </div>
                <div className="col-md-5">
                    <div className="card shadow-sm position-sticky" style={{ top: '20px' }}>
                        <div className="card-header bg-light fw-bold py-3">Đơn hàng của bạn</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {cart.map(item => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center" key={item.product_id}>
                                        <div className="d-flex align-items-center">
                                            <div className="ms-2">
                                                <h6 className="my-0 text-truncate" style={{ maxWidth: '150px' }} title={item.product.name}>{item.product.name}</h6>
                                                <small className="text-muted">x {item.quantity}</small>
                                            </div>
                                        </div>
                                        <span className="text-muted">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between fw-bold bg-light py-3">
                                    <span>Tổng cộng (VND)</span>
                                    <strong className="text-danger fs-5">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
