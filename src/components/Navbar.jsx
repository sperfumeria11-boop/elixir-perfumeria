import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__home-link">Inicio</Link>

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
  );
}

export default Navbar;