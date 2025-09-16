import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/Layout/Layout";
function App() {
  return (
    <Router>
      <CartFloat />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/:category" element={<Products />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/faq" element={<StaticFaqSection />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Footer />
    </Router>
  );
}

export default App;
