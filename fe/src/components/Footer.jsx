import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white mt-5">
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-4 footer-section mb-4 mb-md-0">
                        <h5 className="text-white fw-bold mb-3"><i className="bi bi-car-front"></i> Phụ Kiện Ô Tô</h5>
                        <p className="text-muted">Chuyên cung cấp các phụ kiện ô tô chính hãng, chất lượng cao với giá tốt nhất thị trường.</p>
                        <div className="social-links d-flex gap-3 mt-3">
                            <a href="#" title="Facebook" className="text-white-50 fs-5"><i className="bi bi-facebook"></i></a>
                            <a href="#" title="Instagram" className="text-white-50 fs-5"><i className="bi bi-instagram"></i></a>
                            <a href="#" title="YouTube" className="text-white-50 fs-5"><i className="bi bi-youtube"></i></a>
                            <a href="#" title="Zalo" className="text-white-50 fs-5"><i className="bi bi-chat-dots"></i></a>
                        </div>
                    </div>
                    <div className="col-md-2 footer-section mb-4 mb-md-0">
                        <h5 className="text-white fw-bold mb-3">Liên kết</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-white-50 text-decoration-none d-block mb-2">Trang chủ</Link></li>
                            <li><Link to="/products" className="text-white-50 text-decoration-none d-block mb-2">Sản phẩm</Link></li>
                            <li><Link to="/cart" className="text-white-50 text-decoration-none d-block mb-2">Giỏ hàng</Link></li>
                            <li><Link to="/login" className="text-white-50 text-decoration-none d-block mb-2">Đăng nhập</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-3 footer-section mb-4 mb-md-0">
                        <h5 className="text-white fw-bold mb-3">Hỗ trợ</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-white-50 text-decoration-none d-block mb-2">Về chúng tôi</a></li>
                            <li><a href="#" className="text-white-50 text-decoration-none d-block mb-2">Chính sách bảo hành</a></li>
                            <li><a href="#" className="text-white-50 text-decoration-none d-block mb-2">Hướng dẫn mua hàng</a></li>
                            <li><a href="#" className="text-white-50 text-decoration-none d-block mb-2">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3 footer-section">
                        <h5 className="text-white fw-bold mb-3">Liên hệ</h5>
                        <ul className="list-unstyled text-white-50">
                            <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> 123 Đường ABC, Quận XYZ, TP.HCM</li>
                            <li className="mb-2"><i className="bi bi-telephone me-2"></i> 0123 456 789</li>
                            <li className="mb-2"><i className="bi bi-envelope me-2"></i> info@phukienoto.com</li>
                            <li className="mb-2"><i className="bi bi-clock me-2"></i> 8:00 - 22:00 (T2 - CN)</li>
                        </ul>
                    </div>
                </div>
                <hr className="my-4 border-secondary opacity-25" />
                <div className="row">
                    <div className="col-12 text-center">
                        <p className="mb-0 text-white-50 small">&copy; 2024 Phụ Kiện Ô Tô. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
