import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: '',
        address: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/register', formData);
            login(res.data.user, res.data.access_token);
            navigate('/');
        } catch (err) {
            let message = err.response?.data?.message || err.message;
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                message += '\n' + Object.values(errors).flat().join('\n');
            }
            alert('Đăng ký thất bại: ' + message);
        }
    };

    return (
        <div className="container mt-5 pt-3">
            <div className="row justify-content-center">
                <div className="col-md-6 mb-5">
                    <div className="card shadow-lg p-3">
                        <div className="card-body">
                            <h2 className="text-center mb-4 fw-bold text-success">Đăng Ký Tài Khoản</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tên đăng nhập <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mật khẩu <span className="text-danger">*</span></label>
                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" name="full_name" value={formData.full_name} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Số điện thoại</label>
                                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Địa chỉ</label>
                                    <textarea className="form-control" name="address" value={formData.address} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" className="btn btn-success w-100 py-2 fw-bold">Đăng Ký</button>
                            </form>
                            <div className="mt-3 text-center">
                                <small>Đã có tài khoản? <Link to="/login" className="text-decoration-none">Đăng nhập</Link></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
