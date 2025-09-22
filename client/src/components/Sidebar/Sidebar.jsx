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
  FaTachometerAlt 
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

  // Páginas comuns a todos os usuárops
  const menuItems = [
    { icon: <FaHome size={22} />, text: "Home", to: "/" },
    { icon: <FaEnvelope size={22} />, text: "Contato", to: "/contato" },
    { icon: <FaQuestionCircle size={22} />, text: "FAQ", to: "/faq" },
    !user? { icon: <FaSignInAlt size={22} />, text: "Login", to: "/login" } :
          { icon: <FaSignOutAlt size={22} />, text: "Logout", onClickCallback: logout },
  ];
  
  // Páginas para os compradores ou usuários deslocados
  if(!user || user.role === "user"){
    menuItems.splice(1, 0, {icon: <FaBoxOpen size={22} />, text: "Produtos", to: "/produtos"})
    menuItems.splice(4, 0, {icon: <FaShoppingCart size={22} />, text: "Carrinho", to: "/cart"})
  }

  if(user && !user.role !== "user"){
    // Páginas comuns ao admin e o seller
    
    // Páginas do admin
    if( user.role === "admin" ){
      menuItems.splice(3, 0, {icon: <FaTachometerAlt size={22} />, text: "Dashboard", to: "/admin"})
    }
    // Páginas do vendedor
    else if( user.role === "seller" ){
    }
  }

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
