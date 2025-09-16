import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar"; // Ajuste o caminho se necessário
import { FaBars } from "react-icons/fa";
import "../../styles/Layout.css"; // Importa o CSS dedicado

const Layout = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarDesktopClasses = `layout__sidebar-desktop ${
    isSidebarExpanded
      ? "layout__sidebar-desktop--expanded"
      : "layout__sidebar-desktop--collapsed"
  }`;

  const sidebarMobileClasses = `layout__sidebar-mobile ${
    isMobileMenuOpen ? "layout__sidebar-mobile--open" : ""
  }`;

  return (
    <div className="layout">
      {/* Sidebar Desktop */}
      <div className={sidebarDesktopClasses}>
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggle={() => setSidebarExpanded(!isSidebarExpanded)}
        />
      </div>

      {/* Sidebar Mobile */}
      <div className={sidebarMobileClasses}>
        <div className="layout__sidebar-mobile-content">
          <Sidebar
            isExpanded={true}
            onToggle={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div
          className="layout__overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Conteúdo Principal */}
      <div className="layout__main">
        <header className="layout__header-mobile">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="layout__mobile-menu-button"
          >
            <FaBars size={24} />
          </button>
        </header>

        <main className="layout__main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
