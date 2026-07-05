import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.jpeg';
import './Navbar.css';

function Navbar() {
  const { totalItems } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleNavigation(path) {
    setSidebarOpen(false);
    navigate(path);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          <button className="navbar__hamburger" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>

          <Link to="/" className="navbar__brand">
            <img src={logo} alt="Elixir Perfumería" className="navbar__logo" />
          </Link>

          <Link to="/carrito" className="navbar__cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 0 0 5.414 17H17m-10-4h10" />
              <circle cx="8" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
            {totalItems > 0 && <span className="navbar__cart-count">{totalItems}</span>}
          </Link>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <img src={logo} alt="Elixir Perfumería" className="sidebar__logo" />
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="sidebar__nav">
          <button className="sidebar__link" onClick={() => handleNavigation('/')}>
            🏠 Inicio
          </button>
          <button className="sidebar__link" onClick={() => handleNavigation('/preguntas-frecuentes')}>
            🤔 Preguntas frecuentes
          </button>
          <button className="sidebar__link" onClick={() => handleNavigation('/carrito')}>
            🛒 Mi carrito
          </button>
        </nav>

        <div className="sidebar__footer">
          <p>Síguenos en Instagram</p>
          <a
            href="https://instagram.com/elixir.perfumeria1"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar__instagram"
          >
            @elixir.perfumeria1
          </a>
        </div>
      </aside>
    </>
  );
}

export default Navbar;