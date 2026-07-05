import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminProductForm from './pages/AdminProductForm';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';
import FAQPage from './pages/FAQPage';

function App() {
  return (
    <>
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado" element={<OrderConfirmed />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/preguntas-frecuentes" element={<FAQPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/producto/:id" element={
          <ProtectedRoute>
            <AdminProductForm />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;