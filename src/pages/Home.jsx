import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { getProducts } from '../lib/productService';
import logo from '../assets/logo.jpeg';
import './Home.css';
import Reviews from '../components/Reviews';

function Home() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory, search]);

  const activeCategories = activeCategory === 'todos'
    ? null
    : categories.find((c) => c.id === activeCategory)?.includes || [activeCategory];

  const filteredProducts = products
    .filter((p) => !activeCategories || activeCategories.includes(p.category))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const priceA = a.on_sale && a.discount_price ? a.discount_price : a.price;
      const priceB = b.on_sale && b.discount_price ? b.discount_price : b.price;
      if (sortOrder === 'asc') return priceA - priceB;
      if (sortOrder === 'desc') return priceB - priceA;
      return 0;
    });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const marqueeText = [
    'Perfumes 1.1 Premium',
    'Envíos a todo Colombia',
    'Elegancia en cada aroma',
    'Contraentrega disponible',
    'Decants 1.1',
    'Asesoría personalizada',
  ];

  return (
    <>
      <Navbar />

      <header className="hero">
        <div className="container hero__content">
          <img src={logo} alt="Elixir Perfumería" className="hero__logo" />
        </div>
      </header>

      <div className="marquee">
        <div className="marquee__track">
          {[...marqueeText, ...marqueeText].map((text, i) => (
            <span key={i} className="marquee__item">
              <span className="marquee__dot">✦</span>
              {text}
            </span>
          ))}
        </div>
      </div>

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

      <div className="container toolbar">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Buscar perfume..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="sort-wrap">
          <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="20" y2="12"/>
            <line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          <span className="sort-label">Ordenar:</span>
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Destacados</option>
            <option value="asc">Precio ↑</option>
            <option value="desc">Precio ↓</option>
          </select>
        </div>
      </div>

      <main className="container product-grid">
        {loading ? (
          <p className="loading-text">Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="loading-text">No se encontraron productos.</p>
        ) : (
          <>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {visibleCount < filteredProducts.length && (
              <div className="load-more-wrap">
                <button
                  className="load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  Ver más perfumes
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Reviews />
    </>
  );
}

export default Home;