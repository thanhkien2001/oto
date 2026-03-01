import React, { useState, useEffect } from 'react';
import api from '../../api';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put(`/categories/${formData.id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            fetchCategories();
            setShowForm(false);
            setFormData({ id: null, name: '', description: '' });
        } catch (error) {
            alert('Lỗi khi lưu danh mục: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (category) => {
        setFormData(category);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert('Lỗi xóa danh mục: ' + (error.response?.data?.message || 'Có thể danh mục đang chứa sản phẩm'));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Quản lý Danh mục</h2>
                <button className="btn btn-primary" onClick={() => { setFormData({ id: null, name: '', description: '' }); setShowForm(true); }}>
                    <i className="bi bi-plus-lg me-2"></i> Thêm mới
                </button>
            </div>

            {showForm && (
                <div className="card mb-4 shadow-sm border-0">
                    <div className="card-body">
                        <h5 className="card-title mb-3">{formData.id ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tên danh mục</label>
                                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mô tả</label>
                                <textarea className="form-control" rows="3" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="d-flex gap-2 text-end">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Tên danh mục</th>
                            <th className="py-3 px-4">Mô tả</th>
                            <th className="py-3 px-4 text-end">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td className="px-4 fw-bold">#{cat.id}</td>
                                <td className="px-4 fw-bold text-primary">{cat.name}</td>
                                <td className="px-4 text-muted small">{cat.description}</td>
                                <td className="px-4 text-end">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(cat)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryList;
