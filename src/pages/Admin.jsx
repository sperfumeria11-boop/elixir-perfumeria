import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, deleteProduct, updateProduct, getReviews, deleteReview, createReview } from '../lib/productService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Admin.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CATEGORIES = [
  { value: '', label: 'Todas las categorías' },
  { value: 'dama', label: 'Dama' },
  { value: 'caballero', label: 'Caballero' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'arabes_dama', label: 'Árabes Dama' },
  { value: 'arabes_caballero', label: 'Árabes Caballero' },
  { value: 'arabes_unisex', label: 'Árabes Unisex' },
  { value: 'decants', label: 'Decants' },
  { value: 'sets', label: 'Sets / Combos' },
  { value: 'combos', label: 'Combos' },
];

function SortableRow({ product, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? 'rgba(212, 175, 55, 0.1)' : '',
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <span {...attributes} {...listeners} className="drag-handle" title="Arrastra para reordenar">
          ⠿
        </span>
      </td>
      <td>{product.name}</td>
      <td className="admin-table__category">{product.category}</td>
      <td>${product.price.toLocaleString('es-CO')}</td>
      <td className="admin-table__actions">
        <button className="admin-btn-edit" onClick={() => onEdit(product.id)}>Editar</button>
        <button className="admin-btn-delete" onClick={() => onDelete(product.id)}>Eliminar</button>
      </td>
    </tr>
  );
}

function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('productos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '', review: '', rating: 5, product_name: '', image_url: '',
  });
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [p, r] = await Promise.all([getProducts(), getReviews()]);
    setProducts(p);
    setReviews(r);
    setLoading(false);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const currentList = categoryFilter
      ? products.filter((p) => p.category === categoryFilter)
      : products;

    const oldIndex = currentList.findIndex((p) => p.id === active.id);
    const newIndex = currentList.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(currentList, oldIndex, newIndex);

    if (categoryFilter) {
      const otherProducts = products.filter((p) => p.category !== categoryFilter);
      setProducts([...otherProducts, ...reordered]);
    } else {
      setProducts(reordered);
    }

    await Promise.all(
      reordered.map((product, index) =>
        updateProduct(product.id, { sort_order: index })
      )
    );
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
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: data });
    const result = await res.json();
    return result.secure_url;
  }

  async function handleCreateReview(e) {
    e.preventDefault();
    const image_url = await uploadReviewImage();
    await createReview({ ...reviewForm, rating: Number(reviewForm.rating), image_url });
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

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => categoryFilter ? p.category === categoryFilter : true);

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
          <button className="admin-btn-signout" onClick={handleSignOut}>Cerrar sesión</button>
        </div>
      </header>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'productos' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('productos')}>
          📦 Productos
        </button>
        <button className={`admin-tab ${activeTab === 'reseñas' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('reseñas')}>
          ⭐ Reseñas
        </button>
      </div>

      {activeTab === 'productos' && (
        <main className="admin-main">
          <div className="admin-search-bar">
            <div className="admin-search-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-search-icon">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              {searchQuery && (
                <button className="admin-search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
            <select
              className="admin-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <p className="admin-results-count">
            {filteredProducts.length === products.length
              ? `${products.length} productos en total`
              : `Mostrando ${filteredProducts.length} de ${products.length} productos`
            }
          </p>

          {loading ? (
            <p className="admin-loading">Cargando...</p>
          ) : (
            <>
              {searchQuery ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td></td>
                        <td>{product.name}</td>
                        <td className="admin-table__category">{product.category}</td>
                        <td>${product.price.toLocaleString('es-CO')}</td>
                        <td className="admin-table__actions">
                          <button className="admin-btn-edit" onClick={() => navigate(`/admin/producto/${product.id}`)}>Editar</button>
                          <button className="admin-btn-delete" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  <p className="admin-drag-hint">
                    ⠿ Arrastra los productos para cambiar el orden
                    {categoryFilter && ` en "${CATEGORIES.find(c => c.value === categoryFilter)?.label}"`}
                  </p>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <SortableRow
                              key={product.id}
                              product={product}
                              onEdit={(id) => navigate(`/admin/producto/${id}`)}
                              onDelete={handleDeleteProduct}
                            />
                          ))}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </>
              )}
            </>
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
                  <input type="text" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} required />
                </div>
                <div className="form-field">
                  <label>Calificación *</label>
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
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
                <input type="text" placeholder="Ej: Versace Eros" value={reviewForm.product_name} onChange={(e) => setReviewForm({ ...reviewForm, product_name: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Foto del cliente (opcional)</label>
                <div className="image-upload-area">
                  {reviewImagePreview ? (
                    <img src={reviewImagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder"><span>📷</span><p>Sin foto</p></div>
                  )}
                  <input type="file" accept="image/*" className="image-input" onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setReviewImageFile(file);
                    setReviewImagePreview(URL.createObjectURL(file));
                  }} />
                  <p className="image-hint">Haz clic para seleccionar una foto</p>
                </div>
              </div>
              <div className="form-field">
                <label>Reseña *</label>
                <textarea rows={3} value={reviewForm.review} onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })} required />
              </div>
              <div className="review-form__actions">
                <button type="submit" className="admin-btn-add">Guardar reseña</button>
                <button type="button" className="admin-btn-signout" onClick={() => {
                  setShowReviewForm(false);
                  setReviewImageFile(null);
                  setReviewImagePreview(null);
                }}>Cancelar</button>
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
                        <img src={review.image_url} alt={review.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : '—'}
                    </td>
                    <td>
                      <button className="admin-btn-delete" onClick={() => handleDeleteReview(review.id)}>Eliminar</button>
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