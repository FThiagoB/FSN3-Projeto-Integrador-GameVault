import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/Home/HomePage.jsx";
import Products from "./pages/Product/Products.jsx";
import ProductDetail from "./pages/Product/ProductDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import NotFound from "./pages/404/NotFound.jsx";
import StaticFaqSection from "./pages/Faq/Faqs.jsx";
import CartFloat from "./components/cartFloat/CartFloat.jsx";
import CheckoutPage from "./pages/Checkout/Checkout.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import SignupPage from "./pages/Signup/SignupPage.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Admin from "./pages/Adm/Admin.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import ProfileSettings from "./pages/Profiles/Profile.jsx";
function App() {
  return (
    <Router>
      <CartFloat />
      <Layout>
        <Navbar />
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Footer />
    </Router>
  );
}

export default App;
