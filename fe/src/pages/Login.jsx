import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', { username, password });
            login(res.data.user, res.data.access_token);
            navigate('/');
        } catch (err) {
            alert('Đăng nhập thất bại: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg p-4">
                        <div className="card-body">
                            <h2 className="text-center mb-4 fw-bold text-primary">Đăng Nhập</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tên đăng nhập</label>
                                    <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Nhập tên đăng nhập" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Mật khẩu</label>
                                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Đăng Nhập</button>
                            </form>
                            <div className="mt-3 text-center">
                                <small>Chưa có tài khoản? <Link to="/register" className="text-decoration-none">Đăng ký ngay</Link></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
