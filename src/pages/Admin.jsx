import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, deleteProduct, getReviews, deleteReview, createReview } from '../lib/productService';
import './Admin.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('productos');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    review: '',
    rating: 5,
    product_name: '',
    image_url: '',
  });
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [p, r] = await Promise.all([getProducts(), getReviews()]);
    setProducts(p);
    setReviews(r);
    setLoading(false);
  }

  async function handleDeleteProduct(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    await deleteProduct(id);
    fetchAll();
  }

  async function handleDeleteReview(id) {
    if (!confirm('¿Seguro que quieres eliminar esta reseña?')) return;
    await deleteReview(id);
    fetchAll();
  }

  async function uploadReviewImage() {
    if (!reviewImageFile) return '';
    const data = new FormData();
    data.append('file', reviewImageFile);
    data.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  }

  async function handleCreateReview(e) {
    e.preventDefault();
    const image_url = await uploadReviewImage();
    await createReview({
      ...reviewForm,
      rating: Number(reviewForm.rating),
      image_url,
    });
    setReviewForm({ name: '', review: '', rating: 5, product_name: '', image_url: '' });
    setReviewImageFile(null);
    setReviewImagePreview(null);
    setShowReviewForm(false);
    fetchAll();
  }

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <h1 className="admin-title">Panel Admin — Elixir Perfumería</h1>
        <div className="admin-header__actions">
          {activeTab === 'productos' && (
            <button className="admin-btn-add" onClick={() => navigate('/admin/producto/nuevo')}>
              + Agregar producto
            </button>
          )}
          {activeTab === 'reseñas' && (
            <button className="admin-btn-add" onClick={() => setShowReviewForm(!showReviewForm)}>
              + Agregar reseña
            </button>
          )}
          <button className="admin-btn-signout" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'productos' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos
        </button>
        <button
          className={`admin-tab ${activeTab === 'reseñas' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('reseñas')}
        >
          ⭐ Reseñas
        </button>
      </div>

      {activeTab === 'productos' && (
        <main className="admin-main">
          {loading ? (
            <p className="admin-loading">Cargando...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td className="admin-table__category">{product.category}</td>
                    <td>${product.price.toLocaleString('es-CO')}</td>
                    <td className="admin-table__actions">
                      <button
                        className="admin-btn-edit"
                        onClick={() => navigate(`/admin/producto/${product.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      )}

      {activeTab === 'reseñas' && (
        <main className="admin-main">
          {showReviewForm && (
            <form className="review-form" onSubmit={handleCreateReview}>
              <h3>Nueva reseña</h3>
              <div className="form-row">
                <div className="form-field">
                  <label>Nombre del cliente *</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Calificación *</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 estrellas</option>
                    <option value={4}>⭐⭐⭐⭐ 4 estrellas</option>
                    <option value={3}>⭐⭐⭐ 3 estrellas</option>
                    <option value={2}>⭐⭐ 2 estrellas</option>
                    <option value={1}>⭐ 1 estrella</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Producto (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Versace Eros"
                  value={reviewForm.product_name}
                  onChange={(e) => setReviewForm({ ...reviewForm, product_name: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Foto del cliente (opcional)</label>
                <div className="image-upload-area">
                  {reviewImagePreview ? (
                    <img src={reviewImagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">
                      <span>📷</span>
                      <p>Sin foto</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="image-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setReviewImageFile(file);
                      setReviewImagePreview(URL.createObjectURL(file));
                    }}
                  />
                  <p className="image-hint">Haz clic para seleccionar una foto</p>
                </div>
              </div>

              <div className="form-field">
                <label>Reseña *</label>
                <textarea
                  rows={3}
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                  required
                />
              </div>

              <div className="review-form__actions">
                <button type="submit" className="admin-btn-add">Guardar reseña</button>
                <button
                  type="button"
                  className="admin-btn-signout"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewImageFile(null);
                    setReviewImagePreview(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="admin-loading">Cargando...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Reseña</th>
                  <th>Calificación</th>
                  <th>Producto</th>
                  <th>Foto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.name}</td>
                    <td style={{ maxWidth: '250px', fontSize: '13px' }}>{review.review}</td>
                    <td>{'⭐'.repeat(review.rating)}</td>
                    <td>{review.product_name || '—'}</td>
                    <td>
                      {review.image_url ? (
                        <img
                          src={review.image_url}
                          alt={review.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : '—'}
                    </td>
                    <td>
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      )}
    </div>
  );
}

export default Admin;