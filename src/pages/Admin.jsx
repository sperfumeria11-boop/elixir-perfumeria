import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, deleteProduct } from '../lib/productService';
import './Admin.css';

function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    await deleteProduct(id);
    fetchProducts();
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
          <button className="admin-btn-add" onClick={() => navigate('/admin/producto/nuevo')}>
            + Agregar producto
          </button>
          <button className="admin-btn-signout" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-main">
        {loading ? (
          <p className="admin-loading">Cargando productos...</p>
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
                      onClick={() => handleDelete(product.id)}
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
    </div>
  );
}

export default Admin;