import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { getProducts } from '../lib/productService';
import logo from '../assets/logo.jpeg';
import './Home.css';

function Home() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === 'todos'
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <>
      <Navbar />

      <header className="hero">
        <div className="container">
          <img src={logo} alt="Elixir Perfumería" className="hero__logo" />
          <p className="hero__subtitle">Perfumes originales y decants · Envíos a todo el país</p>
        </div>
      </header>

      <section className="categories">
        <div className="container categories__list">
          <button
            className={`category-pill ${activeCategory === 'todos' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('todos')}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'category-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      <main className="container product-grid">
        {loading ? (
          <p className="loading-text">Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="loading-text">No hay productos en esta categoría.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </>
  );
}

export default Home;