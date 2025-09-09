import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import StaticFaqSection from "./pages/faq";
import CartFloat from "./components/cartFloat/CartFloat";
import CheckoutPage from "./pages/Checkout";

function App() {
  return (
    <Router>
      <Header />
      <CartFloat />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/produtos/:category" element={<Products />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/faq" element={<StaticFaqSection />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
