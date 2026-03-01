import React, { useState, useEffect } from 'react';
import api from '../../api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        category_id: '',
        name: '',
        price: '',
        description: '',
        image_url: '',
        stock: ''
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pRes, cRes] = await Promise.all([
                api.get('/products'), // Fetching all products. In real app, configure limit/pagination.
                api.get('/categories')
            ]);
            setProducts(pRes.data);
            setCategories(cRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('category_id', formData.category_id);
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('description', formData.description || '');
            data.append('stock', formData.stock);

            if (imageFile) {
                data.append('image', imageFile);
            }
            if (formData.id) {
                // Laravel PUT with FormData often requires _method workaround or POST with _method=PUT
                // Or just use POST on update route if supported, but typically Laravel resource uses PUT.
                // FormData via Axios PUT can be tricky. Using POST with _method spoofing is safer for files.
                data.append('_method', 'PUT');
                await api.post(`/products/${formData.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchData();
            setShowForm(false);
            setFormData({ id: null, category_id: '', name: '', price: '', description: '', image_url: '', stock: '' });
            setImageFile(null);
            setPreviewImage(null);
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (product) => {
        setFormData(product);
        setPreviewImage(null);
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa sản phẩm'));
        }
    };

    if (loading) return <div>Loading...</div>;

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads';

    return (
        <div>
            <h2 className="mb-4">Quản lý Sản phẩm</h2>

            <div className="mb-3">
                <button className="btn btn-primary" onClick={() => { setFormData({ id: null, category_id: categories[0]?.id || '', name: '', price: '', description: '', image_url: '', stock: '' }); setShowForm(true); }}>
                    <i className="bi bi-plus-circle"></i> Thêm sản phẩm mới
                </button>
            </div>

            {showForm && (
                <div className="card mb-4 shadow-sm border-0">
                    <div className="card-body">
                        <h5 className="card-title mb-3">{formData.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="mb-3">
                                        <label className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Danh mục <span className="text-danger">*</span></label>
                                        <select className="form-select" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} required>
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Giá bán (đ) <span className="text-danger">*</span></label>
                                                <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required min="0" step="1000" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Số lượng tồn kho</label>
                                                <input type="number" className="form-control" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} min="0" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả sản phẩm</label>
                                        <textarea className="form-control" rows="5" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh</label>
                                        <input type="file" className="form-control" onChange={e => handleFileChange(e)} accept="image/*" />
                                        <small className="text-muted d-block mt-1">
                                            Định dạng: JPG, PNG, GIF, WEBP.
                                        </small>
                                        <div className="mt-2">
                                            {previewImage ? (
                                                <img src={previewImage}
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }}
                                                    alt="Preview" />
                                            ) : (
                                                <img src={formData.image_url ? `${IMAGE_BASE_URL}/${formData.image_url}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }}
                                                    alt="Current"
                                                    onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <button type="submit" className="btn btn-primary me-2">
                                    <i className="bi bi-check-circle"></i> {formData.id ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                    <i className="bi bi-arrow-left"></i> Quay lại
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!showForm && (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>
                                            <img src={product.image_url ? `${IMAGE_BASE_URL}/${product.image_url}` : 'https://via.placeholder.com/60'}
                                                width="60" height="60" className="object-fit-cover" alt={product.name}
                                                onError={e => e.target.src = 'https://via.placeholder.com/60'} />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category?.name}</td>
                                        <td>{new Intl.NumberFormat('vi-VN').format(product.price)} đ</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(product)}>
                                                <i className="bi bi-pencil"></i> Sửa
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
                                                <i className="bi bi-trash"></i> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Chưa có sản phẩm nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
