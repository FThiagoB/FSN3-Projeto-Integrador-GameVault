import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar"; // Ajuste o caminho se necessário
import { FaBars } from "react-icons/fa";
import styles from "./layout.module.css"; // Importa o CSS Module

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

  const sidebarDesktopClasses = `${styles.sidebarDesktop} ${
    isSidebarExpanded
      ? styles.sidebarDesktopExpanded
      : styles.sidebarDesktopCollapsed
  }`;

  const sidebarMobileClasses = `${styles.sidebarMobile} ${
    isMobileMenuOpen ? styles.sidebarMobileOpen : ""
  }`;

  return (
    <div className={styles.layout}>
      {/* Sidebar Desktop */}
      <div className={sidebarDesktopClasses}>
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggle={() => setSidebarExpanded(!isSidebarExpanded)}
        />
      </div>

      {/* Sidebar Mobile */}
      <div className={sidebarMobileClasses}>
        <div className={styles.sidebarMobileContent}>
          <Sidebar
            isExpanded={true}
            onToggle={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Conteúdo Principal */}
      <div className={styles.main}>
        <header className={styles.headerMobile}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={styles.mobileMenuButton}
          >
            <FaBars size={24} />
          </button>
        </header>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
