import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import {
  FaHome,
  FaBoxOpen,
  FaQuestionCircle,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaEnvelope,
  FaChevronLeft,
  FaTachometerAlt,
  FaMoneyBillWave  
} from "react-icons/fa";
import "./Sidebar.css";

const SidebarItem = ({
  icon,
  text,
  to,
  isExpanded,
  onClickCallback = () => {},
}) => {
  const location = useLocation();
  const isActive = to && location.pathname === to;

  const linkClasses = `sidebar__item ${
    isActive ? "sidebar__item--active" : ""
  }`;

  // Se for uma ação (logout), usamos um botão. Senão, um Link.
  if (onClickCallback && !to) {
    return (
      <button className={linkClasses} onClick={onClickCallback}>
        <div className="sidebar__item-icon">{icon}</div>
        <span
          className={`sidebar__item-text ${
            isExpanded ? "sidebar__item-text--visible" : ""
          }`}
        >
          {text}
        </span>
      </button>
    );
  }

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
  const { user, logout } = useAuth();

  // 1. SEPARAÇÃO DOS ITENS
  // Item de autenticação (Login ou Logout)
  const authActionItem = !user
    ? { icon: <FaSignInAlt size={22} />, text: "Login", to: "/login" }
    : {
        icon: <FaSignOutAlt size={22} />,
        text: "Logout",
        onClickCallback: logout,
      };

  const mainLinks = [
  ];

  if (!user || user.role === "user") {
    mainLinks.splice(0, 0, {
      icon: <FaHome size={22} />,
      text: "Home",
      to: "/",
    });
    mainLinks.splice(1, 0, {
      icon: <FaBoxOpen size={22} />,
      text: "Produtos",
      to: "/produtos",
    });
    mainLinks.splice(2, 0, {
      icon: <FaShoppingCart size={22} />,
      text: "Carrinho",
      to: "/cart",
    });
    mainLinks.splice(3, 0, {
      icon: <FaEnvelope size={22} />,
      text: "Contato",
      to: "/contato",
    });
    mainLinks.splice(4, 0, {
      icon: <FaQuestionCircle size={22} />,
      text: "FAQ",
      to: "/faq",
    });
  }

  if (user && user.role === "admin") {
    mainLinks.splice(0, 0, {
      icon: <FaTachometerAlt size={22} />,
      text: "Dashboard",
      to: "/admin",
    });
  }

  if (user && user.role === "seller") {
     mainLinks.splice(1, 0, {
      icon: <FaEnvelope size={22} />,
      text: "Contato",
      to: "/contato",
    });
    mainLinks.splice(2, 0, {
      icon: <FaQuestionCircle size={22} />,
      text: "FAQ",
      to: "/faq",
    });
    mainLinks.splice(0, 0,{
      icon: <FaMoneyBillWave size={22} />,
      text: "My Sales",
      to: "/profile/seller-orders",
    });
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <div className="sidebar__header">
          <div
            className={`sidebar__logo-container ${
              !isExpanded ? "sidebar__logo-container--collapsed" : ""
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

        {/* --- LINKS --- */}
        <div className="sidebar__menu-container">
          <ul className="sidebar__menu">
            {mainLinks.map((item) => (
              <li key={item.text}>
                <SidebarItem {...item} isExpanded={isExpanded} />
              </li>
            ))}
          </ul>
        </div>

        {/* --- (LOGIN/LOGOUT) --- */}
        <div className="sidebar__footer">
          <SidebarItem {...authActionItem} isExpanded={isExpanded} />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
