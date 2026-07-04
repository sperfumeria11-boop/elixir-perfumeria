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
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const activeCategories = activeCategory === 'todos'
    ? null
    : categories.find((c) => c.id === activeCategory)?.includes || [activeCategory];

  const filteredProducts = products
    .filter((p) => !activeCategories || activeCategories.includes(p.category))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />

      <header className="hero">
        <div className="container">
          <img src={logo} alt="Elixir Perfumería" className="hero__logo" />
          <p className="hero__subtitle">Perfumes 1.1 premium · Envíos a todo el país</p>
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

      <div className="container search-bar-wrap">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Buscar perfume..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="container product-grid">
        {loading ? (
          <p className="loading-text">Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="loading-text">No se encontraron productos.</p>
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