import React, { useState, useEffect } from 'react';
import api from '../../api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/admin/orders/${id}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert('Lỗi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="mb-4">Quản lý Đơn hàng</h2>

            <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="py-3 px-4">Mã ĐH</th>
                            <th className="py-3 px-4">Khách hàng</th>
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
                                <td className="px-4">
                                    <div className="fw-bold">{order.customer_name}</div>
                                    <small className="text-muted">{order.customer_phone}</small>
                                </td>
                                <td className="px-4 text-muted small">{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                                <td className="px-4 text-danger fw-bold">{new Intl.NumberFormat('vi-VN').format(order.total_amount)} đ</td>
                                <td className="px-4">
                                    <select
                                        className={`form-select form-select-sm border-0 fw-bold ${order.status === 'Chờ xác nhận' ? 'text-warning bg-warning-subtle' :
                                                order.status === 'Đã giao' ? 'text-success bg-success-subtle' :
                                                    order.status === 'Đã hủy' ? 'text-danger bg-danger-subtle' : 'text-primary bg-primary-subtle'
                                            }`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        style={{ width: 'auto', minWidth: '140px' }}
                                    >
                                        <option className="bg-white text-dark" value="Chờ xác nhận">Chờ xác nhận</option>
                                        <option className="bg-white text-dark" value="Đang giao">Đang giao</option>
                                        <option className="bg-white text-dark" value="Đã giao">Đã giao</option>
                                        <option className="bg-white text-dark" value="Đã hủy">Đã hủy</option>
                                    </select>
                                </td>
                                <td className="px-4 text-end">
                                    <button className="btn btn-sm btn-outline-info rounded-pill" onClick={() => setSelectedOrder(order)}>
                                        Xem <i className="bi bi-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content shadow">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">Chi tiết đơn hàng #{selectedOrder.id}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h6 className="text-uppercase text-muted small fw-bold mb-3">Thông tin khách hàng</h6>
                                        <p className="mb-1"><strong>Tên:</strong> {selectedOrder.customer_name}</p>
                                        <p className="mb-1"><strong>SĐT:</strong> {selectedOrder.customer_phone}</p>
                                        <p className="mb-1"><strong>Địa chỉ:</strong> {selectedOrder.customer_address}</p>
                                        {selectedOrder.user && <p className="mb-0 text-primary small"><i className="bi bi-person-fill"></i> Thành viên: {selectedOrder.user.username}</p>}
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <h6 className="text-uppercase text-muted small fw-bold mb-3">Thông tin đơn hàng</h6>
                                        <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
                                        <p className="mb-1"><strong>Trạng thái:</strong> <span className="badge bg-secondary">{selectedOrder.status}</span></p>
                                    </div>
                                </div>
                                <h6 className="text-uppercase text-muted small fw-bold mb-3">Sản phẩm</h6>
                                <div className="table-responsive border rounded">
                                    <table className="table table-borderless mb-0 align-middle">
                                        <thead className="table-light border-bottom">
                                            <tr>
                                                <th className="py-2 px-3">Sản phẩm</th>
                                                <th className="py-2 px-3 text-center">Đơn giá</th>
                                                <th className="py-2 px-3 text-center">SL</th>
                                                <th className="py-2 px-3 text-end">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.details.map(det => (
                                                <tr key={det.id} className="border-bottom">
                                                    <td className="px-3">
                                                        <div className="d-flex align-items-center">
                                                            <img src={`/uploads/${det.product.image_url}`} width="40" height="40" className="rounded border me-2" alt="" onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                                                            <span className="fw-medium">{det.product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 text-center">{new Intl.NumberFormat('vi-VN').format(det.unit_price)}</td>
                                                    <td className="px-3 text-center">{det.quantity}</td>
                                                    <td className="px-3 text-end fw-bold">{new Intl.NumberFormat('vi-VN').format(det.unit_price * det.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold py-3 px-3">Tổng cộng:</td>
                                                <td className="text-end fw-bold text-danger py-3 px-3 fs-5">{new Intl.NumberFormat('vi-VN').format(selectedOrder.total_amount)} đ</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 bg-light">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
