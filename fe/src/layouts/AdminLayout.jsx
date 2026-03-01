import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/login');
            } else if (user.role !== 'admin') {
                navigate('/');
            }
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!user || user.role !== 'admin') return null; // Will redirect via useEffect

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <div className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? '' : 'd-none d-md-block'}`}
                style={{ width: '250px', transition: 'all 0.3s' }}>
                <div className="d-flex align-items-center mb-4 text-decoration-none text-white">
                    <span className="fs-4 fw-bold">Admin Panel</span>
                </div>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mb-2">
                        <Link to="/admin" className={`nav-link text-white ${location.pathname === '/admin' ? 'active bg-primary' : ''}`}>
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/admin/categories" className={`nav-link text-white ${isActive('/admin/categories') ? 'active bg-primary' : ''}`}>
                            <i className="bi bi-grid me-2"></i> Danh mục
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/admin/products" className={`nav-link text-white ${isActive('/admin/products') ? 'active bg-primary' : ''}`}>
                            <i className="bi bi-box-seam me-2"></i> Sản phẩm
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/admin/orders" className={`nav-link text-white ${isActive('/admin/orders') ? 'active bg-primary' : ''}`}>
                            <i className="bi bi-cart me-2"></i> Đơn hàng
                        </Link>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a href="#" className={`d-flex align-items-center text-white text-decoration-none dropdown-toggle ${dropdownOpen ? 'show' : ''}`}
                        id="dropdownUser1"
                        onClick={(e) => { e.preventDefault(); setDropdownOpen(!dropdownOpen); }}
                        aria-expanded={dropdownOpen}>
                        <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="" width="32" height="32" className="rounded-circle me-2" />
                        <strong>{user?.username || 'Admin'}</strong>
                    </a>
                    <ul className={`dropdown-menu dropdown-menu-dark text-small shadow ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownUser1"
                        style={{ position: 'absolute', transform: 'translate3d(0px, -118px, 0px)', top: '0px', left: '0px', willChange: 'transform' }}>
                        <li><button className="dropdown-item" onClick={() => { logout(); navigate('/login'); }}>Sign out</button></li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
                <header className="navbar navbar-light bg-white shadow-sm px-3 d-md-none">
                    <button className="navbar-toggler" type="button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <span className="navbar-brand mb-0 h1">Admin</span>
                </header>
                <div className="p-4" style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
