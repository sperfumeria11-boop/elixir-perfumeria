import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import FilterPanel, { familyGroups } from '../components/FilterPanel';
import { getProducts } from '../lib/productService';
import logo from '../assets/logo.jpeg';
import './Home.css';
import Reviews from '../components/Reviews';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeFamilies, setActiveFamilies] = useState([]);
  const [activeSpecial, setActiveSpecial] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setVisibleCount(20);
  }, [activeCategory, activeFamilies, activeSpecial, search]);

  const filteredProducts = products
    .filter((p) => {
      if (activeSpecial === 'destacados') return p.is_featured;
      if (activeSpecial === 'mas_vendidos') return p.is_bestseller;
      if (activeSpecial === 'ofertas') return p.on_sale;
      if (activeSpecial === 'precio_asc' || activeSpecial === 'precio_desc') return true;

      if (activeCategory !== 'todos') {
        const includes = {
          dama: ['dama', 'unisex'],
          caballero: ['caballero', 'unisex'],
          arabes_dama: ['arabes_dama', 'arabes_unisex'],
          arabes_caballero: ['arabes_caballero', 'arabes_unisex'],
          decants: ['decants'],
          sets: ['sets'],
          combos: ['combos'],
        }[activeCategory] || [activeCategory];
        if (!includes.includes(p.category)) return false;
      }

      if (activeFamilies.length > 0) {
        const familyLower = (p.family || '').toLowerCase();
        const matches = activeFamilies.some((fId) => {
          const group = familyGroups.find((g) => g.id === fId);
          return group?.keywords.some((kw) => familyLower.includes(kw));
        });
        if (!matches) return false;
      }

      return true;
    })
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const priceA = a.on_sale && a.discount_price ? a.discount_price : a.price;
      const priceB = b.on_sale && b.discount_price ? b.discount_price : b.price;
      if (activeSpecial === 'precio_asc') return priceA - priceB;
      if (activeSpecial === 'precio_desc') return priceB - priceA;
      return 0;
    });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const activeFiltersCount =
    (activeCategory !== 'todos' ? 1 : 0) +
    activeFamilies.length +
    (activeSpecial ? 1 : 0);

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

      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeFamilies={activeFamilies}
        onFamilyChange={setActiveFamilies}
        activeSpecial={activeSpecial}
        onSpecialChange={setActiveSpecial}
      />

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
          <button
            className={`category-pill ${activeCategory === 'dama' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('dama')}
          >
            🌸 Dama
          </button>
          <button
            className={`category-pill ${activeCategory === 'caballero' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('caballero')}
          >
            🖤 Caballero
          </button>
          <button
            className={`category-pill ${activeCategory === 'arabes_dama' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('arabes_dama')}
          >
            🌙 Árabes Dama
          </button>
          <button
            className={`category-pill ${activeCategory === 'arabes_caballero' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('arabes_caballero')}
          >
            🌙 Árabes Caballero
          </button>
          <button
            className={`category-pill ${activeCategory === 'decants' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('decants')}
          >
            🧪 Decants
          </button>
          <button
            className={`category-pill ${activeCategory === 'sets' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('sets')}
          >
            🎁 Sets
          </button>
          <button
            className={`category-pill ${activeCategory === 'combos' ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory('combos')}
          >
            🛍️ Combos
          </button>
        </div>
          
      </section>

      <div className="container toolbar">
        <button className="filter-btn" onClick={() => setFilterOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          Filtros
          {activeFiltersCount > 0 && (
            <span className="filter-btn__count">{activeFiltersCount}</span>
          )}
        </button>

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
          <>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {visibleCount < filteredProducts.length && (
              <div className="load-more-wrap">
                <button
                  className="load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 20)}
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