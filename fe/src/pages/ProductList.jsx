import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useSearchParams } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get('category');
    const searchTerm = searchParams.get('search') || '';
    const [localSearch, setLocalSearch] = useState(searchTerm);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Construct URL
                // Note: The backend Api/ProductController might need to support 'search' param?
                // The prompt says "backend implemented index with category filtering". 
                // It likely doesn't support search yet. 
                // But for now, let's just fetch by category and filter locally if needed or just pass params.
                // To match PHP behavior exactly, PHP does SQL filter.
                // React app: we can either add search param to API or just assume it works.
                // Let's pass query params.

                let params = {};
                if (categoryId) params.category_id = categoryId;
                // if (searchTerm) params.search = searchTerm; // If backend supports it

                const [prodRes, catRes] = await Promise.all([
                    api.get('/products', { params }),
                    api.get('/categories')
                ]);

                // Client side search filtering if backend doesn't support it yet
                let fetchedProducts = prodRes.data;
                if (searchTerm) {
                    fetchedProducts = fetchedProducts.filter(p =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }

                setProducts(fetchedProducts);
                setCategories(catRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        setLocalSearch(searchTerm);
    }, [categoryId, searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams(prev => {
            if (localSearch) {
                prev.set('search', localSearch);
            } else {
                prev.delete('search');
            }
            return prev;
        });
    };

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads';

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0"><i className="bi bi-grid text-primary"></i> Danh sách sản phẩm</h2>
                <span className="text-muted">
                    {products.length > 0 && `${products.length} sản phẩm`}
                </span>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <form onSubmit={handleSearch}>
                        <div className="input-group">
                            <input type="text" className="form-control"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-8">
                    <div className="btn-group flex-wrap" role="group">
                        <Link to="/products" className={`btn btn-outline-primary ${!categoryId ? 'active' : ''}`}>
                            Tất cả
                        </Link>
                        {categories.map(cat => (
                            <Link key={cat.id}
                                to={`/products?category=${cat.id}`}
                                className={`btn btn-outline-primary ${categoryId == cat.id ? 'active' : ''}`}>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {products.length > 0 ? products.map(product => (
                    <div className="col-md-3 col-sm-6" key={product.id}>
                        <div className="card h-100 shadow-sm product-card border-0">
                            <div className="position-relative bg-light overflow-hidden">
                                <img src={product.image_url ? `${IMAGE_BASE_URL}/${product.image_url}` : 'https://via.placeholder.com/200?text=No+Image'} className="card-img-top product-image" alt={product.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200' }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column p-3">
                                <h5 className="card-title text-truncate fw-bold mb-1" title={product.name}>{product.name}</h5>
                                <p className="card-text text-muted small mb-3">{product.category?.name || categories.find(c => c.id === product.category_id)?.name}</p>
                                <p className="price mt-auto text-danger fw-bold fs-5">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </p>
                                <Link to={`/products/${product.id}`} className="btn btn-primary mt-3">
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12">
                        <div className="alert alert-info py-4 text-center">
                            <i className="bi bi-search display-6 d-block mb-3"></i>
                            Không tìm thấy sản phẩm nào phù hợp.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
