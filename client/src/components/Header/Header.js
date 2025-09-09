import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart, Menu } from "lucide-react";
import Logo from "../../assets/GameVaultLogo.png";
import "../../styles/Header.css";

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Função para verificar se a rota está ativa
  const isActive = (rota) => {
    // Ativa o estilo de ativo em "Jogos" se a rota for /produtos ou /produto
    if (rota === "/produtos") {
      return pathname === "/produtos" || pathname.startsWith("/produto");
    }

    // Ativa se a rota especificada coincidir com a rota da página
    return pathname === rota;
  };

  return (
    <nav className="header">
      <div className="header__container ">
        <Link to="/" className="header__logo">
          <div className="footer-logo-circle">R</div>
          {/* <img src={Logo} alt="GameVault Logo" /> */}
        </Link>

        <button
          className="header__menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <ul className={`header__nav ${menuOpen ? "is-open" : ""}`}>
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/produtos"
              className={isActive("/produtos") ? "active" : ""}
            >
              Jogos
            </Link>
          </li>
          <li>
            <Link
              to="/contato"
              className={isActive("/contato") ? "active" : ""}
            >
              Contato
            </Link>
          </li>
          <li>
            <Link to={"/cart"} className={isActive("/cart") ? "active" : ""}>
              Cart
            </Link>
          </li>
          <li className="header__cart">
            <Link to="/cart" className="cart-link">
              <ShoppingCart className="cart-icon" />
              <span className="cart-count">{itemCount}</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
