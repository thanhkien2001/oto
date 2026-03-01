import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads';

    return (
        <div className="container mt-5">
            <h2 className="mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-cart-check text-primary"></i> Giỏ hàng của bạn
            </h2>
            {cart.length === 0 ? (
                <div className="alert alert-info text-center py-5">
                    <i className="bi bi-info-circle display-4 mb-3 d-block text-primary"></i>
                    <p className="lead mb-4">Giỏ hàng của bạn đang trống.</p>
                    <Link to="/products" className="btn btn-primary btn-lg px-5 rounded-pill">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <>
                    <div className="table-responsive shadow-sm rounded bg-white">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="py-3 px-4">Hình ảnh</th>
                                    <th className="py-3 px-4">Tên sản phẩm</th>
                                    <th className="py-3 px-4">Đơn giá</th>
                                    <th className="py-3 px-4">Số lượng</th>
                                    <th className="py-3 px-4">Thành tiền</th>
                                    <th className="py-3 px-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.product_id}>
                                        <td className="px-4">
                                            <Link to={`/products/${item.product.id}`}>
                                                <img src={item.product.image_url ? `${IMAGE_BASE_URL}/${item.product.image_url}` : 'https://via.placeholder.com/80?text=No+Image'}
                                                    alt={item.product.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                    className="rounded border"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image' }}
                                                />
                                            </Link>
                                        </td>
                                        <td className="px-4 fw-semibold">
                                            <Link to={`/products/${item.product.id}`} className="text-decoration-none text-dark">
                                                {item.product.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 text-secondary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}
                                        </td>
                                        <td className="px-4">
                                            <input type="number"
                                                min="1"
                                                className="form-control text-center cart-quantity border-secondary"
                                                style={{ width: '80px' }}
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-4 fw-bold text-danger">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}
                                        </td>
                                        <td className="px-4">
                                            <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => removeFromCart(item.product_id)}>
                                                <i className="bi bi-trash me-1"></i> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-light">
                                <tr>
                                    <td colSpan="4" className="text-end fw-bold py-3 fs-5">Tổng cộng:</td>
                                    <td colSpan="2" className="fw-bold fs-4 text-danger py-3 px-4">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between mt-5">
                        <Link to="/products" className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                            <i className="bi bi-arrow-left me-2"></i> Tiếp tục mua sắm
                        </Link>
                        <Link to="/checkout" className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                            <i className="bi bi-bag-check me-2"></i> Đặt hàng
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
