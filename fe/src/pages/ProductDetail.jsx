import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(null);

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setMainImage(res.data.image_url);
                // Fetch related products
                if (res.data.category_id) {
                    api.get('/products') // Assuming we fetch enough and filter locally as consistent with current approach
                        .then(r => {
                            const related = r.data
                                .filter(p => p.category_id === res.data.category_id && p.id !== res.data.id)
                                .slice(0, 4);
                            setRelatedProducts(related);
                        });
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert('Đã thêm vào giỏ hàng!');
    };

    const ratingDistribution = { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 };
    const totalReviews = 12;

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/uploads';

    return (
        <div className="container mt-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/products">Sản phẩm</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>
            <div className="row mb-5">
                <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
                    <div className="product-detail-image mb-3 border rounded shadow-sm bg-white p-3">
                        <img src={mainImage ? `${IMAGE_BASE_URL}/${mainImage}` : 'https://via.placeholder.com/400?text=No+Image'}
                            className="img-fluid"
                            alt={product.name}
                            style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image' }}
                        />
                    </div>
                    {/* Fake Thumbnails */}
                    <div className="product-thumbnails row g-2">
                        {[product.image_url, product.image_url, product.image_url, product.image_url].map((img, idx) => (
                            <div className="col-3" key={idx} onClick={() => setMainImage(img)}>
                                <div className={`thumbnail-item border rounded p-1 cursor-pointer ${mainImage === img && idx === 0 ? 'border-primary' : ''}`}>
                                    <img src={img ? `${IMAGE_BASE_URL}/${img}` : 'https://via.placeholder.com/100?text=No+Image'} className="img-fluid" alt={`Thumb ${idx}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-lg-7 col-md-6 product-detail-info ps-md-5">
                    <div className="mb-2">
                        <span className="badge bg-primary">
                            <i className="bi bi-tag"></i> {product.category?.name || 'Phụ kiện'}
                        </span>
                    </div>
                    <h1 className="display-6 fw-bold text-dark">{product.name}</h1>
                    <div className="price mb-3 text-danger fw-bold display-5">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>

                    {product.stock > 0 ? (
                        <div className="stock-badge in-stock mb-3 d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-success bg-opacity-10 text-success fw-bold">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Còn hàng ({product.stock} sản phẩm)</span>
                        </div>
                    ) : (
                        <div className="stock-badge out-of-stock mb-3 d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-danger bg-opacity-10 text-danger fw-bold">
                            <i className="bi bi-x-circle-fill"></i>
                            <span>Hết hàng</span>
                        </div>
                    )}

                    <div className="d-flex align-items-center gap-3 mb-4 mt-3">
                        <label className="form-label mb-0 fw-semibold">Số lượng:</label>
                        <input type="number"
                            className="form-control text-center"
                            value={quantity}
                            min="1"
                            max={product.stock}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{ width: '100px' }}
                        />
                    </div>

                    <div className="d-flex gap-2 flex-wrap mb-4">
                        <button className="btn btn-primary btn-lg px-4" onClick={handleAddToCart} disabled={product.stock <= 0}>
                            <i className="bi bi-cart-plus me-2"></i> Thêm vào giỏ hàng
                        </button>
                        <Link to="/products" className="btn btn-outline-secondary btn-lg px-4">
                            <i className="bi bi-arrow-left me-2"></i> Quay lại
                        </Link>
                    </div>

                    {product.description && (
                        <div className="mt-4 pt-4 border-top">
                            <h5 className="mb-3 fw-bold"><i className="bi bi-info-circle me-2"></i> Mô tả sản phẩm</h5>
                            <p className="text-muted" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>{product.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section - Static for now to match UI */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom py-3">
                            <h4 className="mb-0 fw-bold">
                                <i className="bi bi-star-fill text-warning me-2"></i> Đánh giá sản phẩm
                                <span className="badge bg-primary ms-2 rounded-pill">4.5</span>
                                <small className="text-muted ms-2 fs-6 fw-normal">(12 đánh giá)</small>
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-4 text-center mb-3 mb-md-0 d-flex flex-column justify-content-center">
                                    <div className="display-4 fw-bold text-primary">4.5</div>
                                    <div className="mb-2 text-warning fs-5">
                                        {[1, 2, 3, 4, 5].map(i => <i key={i} className={`bi bi-star-fill ${i <= 4 ? '' : 'text-muted'}`}></i>)}
                                    </div>
                                    <p className="text-muted mb-0">12 đánh giá</p>
                                </div>
                                <div className="col-md-8">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <div className="d-flex align-items-center mb-2" key={star}>
                                            <span className="me-2 fw-medium" style={{ width: '30px' }}>{star} <i className="bi bi-star-fill text-warning"></i></span>
                                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${(ratingDistribution[star] / totalReviews) * 100}%` }}></div>
                                            </div>
                                            <span className="text-muted small" style={{ width: '30px' }}>{ratingDistribution[star]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div className="reviews-list">
                                <div className="review-item mb-4 pb-4 border-bottom">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="mb-1 fw-bold">Nguyễn Văn A <span className="badge bg-success ms-2 rounded-pill"><i className="bi bi-check-circle me-1"></i> Đã mua hàng</span></h6>
                                            <div className="mb-2 text-warning small">
                                                {[1, 2, 3, 4, 5].map(i => <i key={i} className="bi bi-star-fill"></i>)}
                                                <span className="text-muted ms-2">2 ngày trước</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-0 text-muted">Sản phẩm rất tốt, chất lượng cao, đóng gói cẩn thận. Giao hàng nhanh, đúng như mô tả.</p>
                                </div>
                                {/* More dummy reviews could go here */}
                            </div>
                            <div className="text-center mt-4">
                                <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => alert('Tính năng đang phát triển')}>
                                    <i className="bi bi-arrow-down-circle me-2"></i> Xem thêm đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="row mt-5 mb-5">
                    <div className="col-12">
                        <h3 className="mb-4 fw-bold"><i className="bi bi-grid-fill text-primary me-2"></i> Các sản phẩm liên quan</h3>
                        <div className="row g-4">
                            {relatedProducts.map(relProduct => (
                                <div className="col-md-3 col-sm-6" key={relProduct.id}>
                                    <div className="card h-100 shadow-sm product-card border-0">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img src={relProduct.image_url ? `${IMAGE_BASE_URL}/${relProduct.image_url}` : 'https://via.placeholder.com/200?text=No+Image'}
                                                className="card-img-top product-image"
                                                alt={relProduct.name}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }}
                                            />
                                        </div>
                                        <div className="card-body d-flex flex-column p-3">
                                            <h5 className="card-title text-truncate fw-bold mb-1" title={relProduct.name}>{relProduct.name}</h5>
                                            <p className="price mt-auto text-danger fw-bold fs-5">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(relProduct.price)}
                                            </p>
                                            <Link to={`/products/${relProduct.id}`} className="btn btn-primary mt-3">
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
