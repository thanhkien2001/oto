import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await api.get('/categories');
                setCategories(catRes.data);

                // Fetch products (assuming backend returns all products for now, we filter locally or could handle this better)
                // Better approach: fetch specifically for each category or backend endpoint like /home-data
                // For now, I'll fetch broad product list and group them. 
                // However, the original PHP did 1 query per category with LIMIT 4.
                // Since I might not have that endpoint, I'll fetch all products and slice them.
                const prodRes = await api.get('/products');
                const products = prodRes.data;

                const grouped = {};
                catRes.data.forEach(cat => {
                    const catProducts = products.filter(p => p.category_id === cat.id).slice(0, 4);
                    if (catProducts.length > 0) {
                        grouped[cat.id] = catProducts;
                    }
                });
                setProductsByCategory(grouped);

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads';

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    return (
        <div>
            {/* Hero Banner */}
            <div className="hero-banner mb-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold mb-3">Chào mừng đến với Phụ Kiện Ô Tô</h1>
                            <p className="lead mb-4">Nơi cung cấp các phụ kiện ô tô chính hãng, chất lượng cao với giá tốt nhất. Nâng cấp chiếc xe của bạn ngay hôm nay!</p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link className="btn btn-light btn-lg" to="/products">
                                    <i className="bi bi-box-seam me-2"></i> Xem sản phẩm
                                </Link>
                                <Link className="btn btn-outline-light btn-lg" to="/products">
                                    <i className="bi bi-search me-2"></i> Tìm kiếm
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 text-center mt-4 mt-lg-0">
                            <i className="bi bi-car-front text-white" style={{ fontSize: '8rem', opacity: 0.3 }}></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {categories.length === 0 ? (
                    <div className="alert alert-info">Chưa có danh mục nào.</div>
                ) : (
                    categories.map(cat => {
                        const catProducts = productsByCategory[cat.id];
                        if (!catProducts || catProducts.length === 0) return null;

                        return (
                            <div className="category-section mb-5" key={cat.id}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-tag text-primary"></i> {cat.name}
                                    </h2>
                                    <Link to={`/products?category=${cat.id}`} className="btn btn-outline-primary">
                                        Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
                                    </Link>
                                </div>

                                <div className="row g-4">
                                    {catProducts.map(product => (
                                        <div className="col-md-3 col-sm-6" key={product.id}>
                                            <div className="card product-card h-100 shadow-sm border-0">
                                                <div className="position-relative bg-light overflow-hidden">
                                                    <img src={product.image_url ? `${IMAGE_BASE_URL}/${product.image_url}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                                                        className="card-img-top product-image"
                                                        alt={product.name}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }}
                                                    />
                                                </div>
                                                <div className="card-body d-flex flex-column p-4">
                                                    <h5 className="card-title text-truncate fw-bold mb-2" title={product.name}>{product.name}</h5>
                                                    <p className="card-text text-muted small mb-3">{cat.name}</p>
                                                    <p className="price mt-auto mb-3 text-danger fw-bold fs-5">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </p>
                                                    <Link to={`/products/${product.id}`} className="btn btn-primary w-100">
                                                        Xem chi tiết
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}

                <div className="row mt-5 mb-5">
                    <div className="col-12 text-center">
                        <Link to="/products" className="btn btn-outline-primary btn-lg px-5">Xem tất cả sản phẩm</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
