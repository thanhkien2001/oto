import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        counts: { products: 0, categories: 0, orders: 0, users: 0 },
        recentOrders: [],
        charts: {
            revenueByWeek: { labels: [], data: [] },
            revenueByMonth: { labels: [], data: [] },
            revenueByYear: { labels: [], data: [] }
        }
    });
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('week'); // week, month, year

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const getChartData = () => {
        let source;
        if (chartType === 'week') source = stats.charts.revenueByWeek;
        else if (chartType === 'month') source = stats.charts.revenueByMonth;
        else source = stats.charts.revenueByYear;

        if (!source || !source.labels) return [];
        return source.labels.map((label, index) => ({
            name: label,
            DoanhThu: source.data[index]
        }));
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0 text-gray-800 fw-bold">Dashboard Thống Kê</h2>
                <div className="text-muted small">
                    <i className="bi bi-calendar3 me-2"></i>
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
            
            {/* Stat Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2 border-0" style={{ borderLeft: '.25rem solid #4e73df', borderRadius: '10px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                        Tổng Người Dùng</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800 fs-3 fw-bold">{stats.counts.users}</div>
                                </div>
                                <div className="col-auto">
                                    <i className="bi bi-people-fill fa-2x text-gray-300 fs-1 text-primary opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2 border-0" style={{ borderLeft: '.25rem solid #1cc88a', borderRadius: '10px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                        Tổng Đơn Hàng</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800 fs-3 fw-bold">{stats.counts.orders}</div>
                                </div>
                                <div className="col-auto">
                                    <i className="bi bi-cart-check-fill fa-2x text-gray-300 fs-1 text-success opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2 border-0" style={{ borderLeft: '.25rem solid #36b9cc', borderRadius: '10px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sản Phẩm</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800 fs-3 fw-bold">{stats.counts.products}</div>
                                </div>
                                <div className="col-auto">
                                    <i className="bi bi-box-seam-fill fa-2x text-gray-300 fs-1 text-info opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2 border-0" style={{ borderLeft: '.25rem solid #f6c23e', borderRadius: '10px' }}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                        Danh Mục</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800 fs-3 fw-bold">{stats.counts.categories}</div>
                                </div>
                                <div className="col-auto">
                                    <i className="bi bi-tags-fill fa-2x text-gray-300 fs-1 text-warning opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="card-header bg-white border-0 py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary fw-bold" style={{ color: '#4e73df' }}>Biểu Đồ Doanh Thu</h6>
                            <div className="btn-group btn-group-sm shadow-sm" role="group">
                                <button type="button" className={`btn ${chartType === 'week' ? 'btn-primary' : 'btn-light text-secondary'}`} onClick={() => setChartType('week')}>7 Ngày Qua</button>
                                <button type="button" className={`btn ${chartType === 'month' ? 'btn-primary' : 'btn-light text-secondary'}`} onClick={() => setChartType('month')}>Theo Tháng</button>
                                <button type="button" className={`btn ${chartType === 'year' ? 'btn-primary' : 'btn-light text-secondary'}`} onClick={() => setChartType('year')}>Theo Năm</button>
                            </div>
                        </div>
                        <div className="card-body" style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e6f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#858796', fontSize: 12 }} dy={10} />
                                    <YAxis 
                                        tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#858796', fontSize: 12 }} 
                                        dx={-10}
                                    />
                                    <RechartsTooltip 
                                        formatter={(value) => [formatCurrency(value), 'Doanh thu']} 
                                        cursor={{ fill: '#f8f9fc' }} 
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #e3e6f0', boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)' }} 
                                        labelStyle={{ fontWeight: 'bold', color: '#5a5c69', marginBottom: '5px' }}
                                    />
                                    <Bar dataKey="DoanhThu" fill="#4e73df" radius={[4, 4, 0, 0]} barSize={45} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="card border-0 shadow mb-4" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="card-header bg-white py-3 border-0">
                    <h6 className="m-0 font-weight-bold text-primary fw-bold" style={{ color: '#4e73df' }}>Đơn Hàng Gần Đây</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead style={{ backgroundColor: '#f8f9fc', color: '#858796', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <tr>
                                    <th className="py-3 px-4 border-0">Mã ĐH</th>
                                    <th className="py-3 px-4 border-0">Khách Hàng</th>
                                    <th className="py-3 px-4 border-0">Ngày Đặt</th>
                                    <th className="py-3 px-4 border-0 text-end">Tổng Tiền</th>
                                    <th className="py-3 px-4 border-0 text-center">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.length > 0 ? (
                                    stats.recentOrders.map(order => (
                                        <tr key={order.id} style={{ transition: 'all 0.2s ease-in-out' }}>
                                            <td className="px-4 fw-bold text-primary">#{order.id}</td>
                                            <td className="px-4">
                                                <div className="fw-semibold text-gray-800">{order.customer_name}</div>
                                                <div className="text-muted small"><i className="bi bi-telephone-fill me-1 opacity-50"></i>{order.customer_phone}</div>
                                            </td>
                                            <td className="px-4 text-muted small">
                                                <i className="bi bi-clock me-1 opacity-50"></i>
                                                {new Date(order.created_at).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-4 fw-bold text-danger text-end">{formatCurrency(order.total_amount)}</td>
                                            <td className="px-4 text-center">
                                                <span className={`badge rounded-pill fw-normal px-3 py-2 ${
                                                    order.status === 'Chờ xác nhận' ? 'bg-warning text-dark' :
                                                    order.status === 'Đang giao' ? 'bg-info text-dark' :
                                                    order.status === 'Đã giao' ? 'bg-success' :
                                                    order.status === 'Đã hủy' ? 'bg-danger' : 'bg-secondary'
                                                }`} style={{ letterSpacing: '0.5px' }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <div className="d-flex flex-column align-items-center">
                                                <i className="bi bi-inbox fs-1 mb-2 opacity-50"></i>
                                                <p className="mb-0">Chưa có đơn hàng nào.</p>
                                            </div>
                                        </td>
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
