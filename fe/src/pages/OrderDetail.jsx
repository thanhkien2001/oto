import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/orders/${id}`)
            .then(res => setOrder(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (!order) return <div className="text-center mt-5 alert alert-danger">Không tìm thấy đơn hàng.</div>;

    const getStatusClass = (status) => {
        switch (status) {
            case 'Chờ xác nhận': return 'bg-warning text-dark';
            case 'Đã giao': return 'bg-success';
            case 'Đã hủy': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads';

    return (
        <div className="container mt-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/my-orders">Đơn hàng của tôi</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">#{order.id}</li>
                </ol>
            </nav>

            <div className={`card shadow-sm border-0 mb-4`}>
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-primary">
                        <i className="bi bi-box-seam me-2"></i> Chi tiết đơn hàng #{order.id}
                    </h5>
                    <span className={`badge ${getStatusClass(order.status)} rounded-pill px-3 py-2 fs-6`}>
                        {order.status}
                    </span>
                </div>
                <div className="card-body p-4">
                    <div className="row mb-5">
                        <div className="col-md-6 border-end">
                            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Thông tin người nhận</h6>
                            <p className="mb-1 fw-bold">{order.customer_name}</p>
                            <p className="mb-1 text-muted"><i className="bi bi-telephone me-2"></i> {order.customer_phone}</p>
                            <p className="mb-0 text-muted"><i className="bi bi-geo-alt me-2"></i> {order.customer_address}</p>
                        </div>
                        <div className="col-md-6 ps-md-4 mt-4 mt-md-0">
                            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Thông tin thanh toán</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Phương thức:</span>
                                <span className="fw-medium">Thanh toán khi nhận hàng (COD)</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Ngày đặt:</span>
                                <span className="fw-medium">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Sản phẩm</h6>
                    <div className="table-responsive rounded border mb-4">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="py-3 px-4 border-bottom-0">Sản phẩm</th>
                                    <th className="py-3 px-4 text-center border-bottom-0">Đơn giá</th>
                                    <th className="py-3 px-4 text-center border-bottom-0">Số lượng</th>
                                    <th className="py-3 px-4 text-end border-bottom-0">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.details.map(detail => (
                                    <tr key={detail.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <img src={detail.product.image_url ? `${IMAGE_BASE_URL}/${detail.product.image_url}` : 'https://via.placeholder.com/60?text=No+Image'}
                                                    alt={detail.product.name}
                                                    className="rounded border me-3"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image' }}
                                                />
                                                <div>
                                                    <h6 className="mb-0 fw-medium text-dark">{detail.product.name}</h6>
                                                    <small className="text-muted">Mã SP: #{detail.product.id}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 text-center text-secondary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.unit_price)}
                                        </td>
                                        <td className="px-4 text-center fw-medium">{detail.quantity}</td>
                                        <td className="px-4 text-end fw-bold text-dark">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.unit_price * detail.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-light">
                                <tr>
                                    <td colSpan="3" className="text-end py-3 px-4 fw-bold fs-5">Tổng cộng:</td>
                                    <td className="text-end py-3 px-4 fw-bold fs-4 text-danger">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="text-end">
                        <Link to="/my-orders" className="btn btn-outline-secondary rounded-pill px-4">
                            <i className="bi bi-arrow-left me-2"></i> Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
