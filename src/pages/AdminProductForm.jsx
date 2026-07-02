import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../lib/productService';
import './AdminProductForm.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const emptyForm = {
  name: '',
  category: 'dama',
  price: '',
  description: '',
  family: '',
  duration: '',
  intensity: '',
  occasion: '',
  notes_salida: '',
  notes_corazon: '',
  notes_fondo: '',
  image_url: '',
  on_sale: false,
  discount_price: '',
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== 'nuevo';

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      getProductById(id).then((product) => {
        if (product) {
          setForm({
            ...product,
            notes_salida: product.notes_salida?.join(', ') || '',
            notes_corazon: product.notes_corazon?.join(', ') || '',
            notes_fondo: product.notes_fondo?.join(', ') || '',
            discount_price: product.discount_price || '',
          });
          if (product.image_url) setImagePreview(product.image_url);
        }
        setLoadingProduct(false);
      });
    }
  }, [id]);

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage() {
    if (!imageFile) return form.image_url;
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const image_url = await uploadImage();

    const productData = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description,
      family: form.family,
      duration: form.duration,
      intensity: form.intensity,
      occasion: form.occasion,
      image_url,
      on_sale: form.on_sale,
      discount_price: form.on_sale && form.discount_price ? Number(form.discount_price) : null,
      notes_salida: form.notes_salida.split(',').map((n) => n.trim()).filter(Boolean),
      notes_corazon: form.notes_corazon.split(',').map((n) => n.trim()).filter(Boolean),
      notes_fondo: form.notes_fondo.split(',').map((n) => n.trim()).filter(Boolean),
    };

    if (isEditing) {
      await updateProduct(id, productData);
    } else {
      await createProduct(productData);
    }

    setLoading(false);
    navigate('/admin');
  }

  if (loadingProduct) {
    return <div className="admin-form-loading">Cargando producto...</div>;
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <h1>{isEditing ? 'Editar producto' : 'Agregar producto'}</h1>
        <button className="admin-btn-back" onClick={() => navigate('/admin')}>
          ← Volver
        </button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__grid">
          <div className="admin-form__left">

            <div className="form-field">
              <label>Nombre del perfume *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Categoría *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="dama">Dama</option>
                  <option value="caballero">Caballero</option>
                  <option value="arabes">Árabes</option>
                </select>
              </div>
              <div className="form-field">
                <label>Precio normal (COP) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-field">
              <label className="promo-label">
                <input
                  type="checkbox"
                  name="on_sale"
                  checked={form.on_sale}
                  onChange={handleChange}
                  className="promo-checkbox"
                />
                ¿Este producto tiene promoción?
              </label>
            </div>

            {form.on_sale && (
              <div className="form-field promo-field">
                <label>Precio con descuento (COP) *</label>
                <input
                  type="number"
                  name="discount_price"
                  value={form.discount_price}
                  onChange={handleChange}
                  placeholder="Ej: 236000"
                  required={form.on_sale}
                />
                {form.price && form.discount_price && (
                  <p className="promo-preview">
                    Se verá así: <s>${Number(form.price).toLocaleString('es-CO')}</s> → <strong>${Number(form.discount_price).toLocaleString('es-CO')}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="form-field">
              <label>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Familia olfativa</label>
                <input name="family" value={form.family} onChange={handleChange} placeholder="Ej: Floral Afrutada" />
              </div>
              <div className="form-field">
                <label>Duración</label>
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="Ej: 6 - 8 horas" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Intensidad</label>
                <input name="intensity" value={form.intensity} onChange={handleChange} placeholder="Ej: Media" />
              </div>
              <div className="form-field">
                <label>Ocasión</label>
                <input name="occasion" value={form.occasion} onChange={handleChange} placeholder="Ej: Noche" />
              </div>
            </div>

            <div className="form-field">
              <label>Notas de salida <span className="form-hint">(separadas por coma)</span></label>
              <input name="notes_salida" value={form.notes_salida} onChange={handleChange} placeholder="Ej: Pomelo, Limón, Bergamota" />
            </div>

            <div className="form-field">
              <label>Notas de corazón <span className="form-hint">(separadas por coma)</span></label>
              <input name="notes_corazon" value={form.notes_corazon} onChange={handleChange} placeholder="Ej: Rosa, Jazmín" />
            </div>

            <div className="form-field">
              <label>Notas de fondo <span className="form-hint">(separadas por coma)</span></label>
              <input name="notes_fondo" value={form.notes_fondo} onChange={handleChange} placeholder="Ej: Sándalo, Ámbar, Almizcle" />
            </div>

          </div>

          <div className="admin-form__right">
            <div className="form-field">
              <label>Foto del producto</label>
              <div className="image-upload-area">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <span>🧴</span>
                    <p>Sin imagen</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="image-input" />
                <p className="image-hint">Haz clic para seleccionar una foto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form__footer">
          <button type="submit" className="admin-btn-save" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;