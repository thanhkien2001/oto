import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const toggleDropdown = (e) => {
        e.preventDefault();
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <i className="bi bi-car-front text-primary-light" style={{ fontSize: '1.75rem' }}></i>
                    Phụ Kiện Ô Tô
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Sản phẩm</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav align-items-center gap-2">
                        <li className="nav-item">
                            <Link className="nav-link position-relative" to="/cart">
                                <i className="bi bi-cart fs-5"></i>
                                <span className="ms-1 d-none d-lg-inline">Giỏ hàng</span>
                                {cart.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        </li>
                        {user ? (
                            <li className="nav-item dropdown">
                                <a className={`nav-link dropdown-toggle d-flex align-items-center gap-2 ${dropdownOpen ? 'show' : ''}`}
                                    href="#" role="button"
                                    onClick={toggleDropdown}
                                    aria-expanded={dropdownOpen}>
                                    <i className="bi bi-person-circle fs-5"></i>
                                    {user.full_name || user.username}
                                </a>
                                <ul className={`dropdown-menu dropdown-menu-end shadow-sm border-0 ${dropdownOpen ? 'show' : ''}`}
                                    style={{ position: 'absolute', right: 0 }}>
                                    <li><Link className="dropdown-item" to="/my-orders" onClick={() => setDropdownOpen(false)}><i className="bi bi-bag-check me-2"></i> Đơn hàng của tôi</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item text-danger" onClick={() => { logout(); setDropdownOpen(false); }}><i className="bi bi-box-arrow-right me-2"></i> Đăng xuất</button></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="bi bi-person-plus me-1"></i> Đăng ký
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
