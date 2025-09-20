import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

import {
  FaHome,
  FaBoxOpen,
  FaQuestionCircle,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaEnvelope,
  FaChevronLeft,
} from "react-icons/fa";
import "./Sidebar.css";

const SidebarItem = ({ icon, text, to, isExpanded, onClickCallback = () => {} }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // A classe 'active' é adicionada condicionalmente
  const linkClasses = `sidebar__item ${
    isActive ? "sidebar__item--active" : ""
  }`;

  return (
    <Link to={to} className={linkClasses} onClick={onClickCallback}>
      <div className="sidebar__item-icon">{icon}</div>
      <span
        className={`sidebar__item-text ${
          isExpanded ? "sidebar__item-text--visible" : ""
        }`}
      >
        {text}
      </span>
    </Link>
  );
};



const Sidebar = ({ isExpanded, onToggle }) => {
  // Obtem as informações do usuário se logado
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: <FaHome size={22} />, text: "Home", to: "/" },
    { icon: <FaBoxOpen size={22} />, text: "Produtos", to: "/produtos" },
    { icon: <FaEnvelope size={22} />, text: "Contato", to: "/contato" },
    { icon: <FaQuestionCircle size={22} />, text: "FAQ", to: "/faq" },
    { icon: <FaShoppingCart size={22} />, text: "Carrinho", to: "/cart" },
    !user? { icon: <FaSignInAlt size={22} />, text: "Login", to: "/login" } :
          { icon: <FaSignOutAlt size={22} />, text: "Logout", onClickCallback: logout },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <div className="sidebar__header">
          <div
            className={`sidebar__logo-container ${
              isExpanded ? "sidebar__logo-container--collapsed" : ""
            }`}
          >
            <span
              role="img"
              aria-label="Joystick"
              className="sidebar__logo-icon"
            >
              🕹️
            </span>
            {isExpanded && (
              <h1
                className={`sidebar__logo-text ${
                  isExpanded ? "" : "sidebar__logo-text--visible"
                }`}
              >
                RETRO
              </h1>
            )}
          </div>
          <button onClick={onToggle} className="sidebar__toggle-desktop">
            <FaChevronLeft
              size={20}
              className={`sidebar__toggle-icon ${
                !isExpanded ? "sidebar__toggle-icon--collapsed" : ""
              }`}
            />
          </button>
        </div>

        <ul className="sidebar__menu">
          {menuItems.map((item) => (
            <SidebarItem key={item.text} {...item} isExpanded={isExpanded} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
