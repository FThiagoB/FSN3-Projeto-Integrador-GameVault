import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import styles from "./notfound.module.css";

const NotFoundPage = () => (
  <div className={styles.notfoundRetro}>
    <main id="content" className={styles.notfoundMain}>
      <div className={styles.notfoundContent}>
        <FaExclamationTriangle
          style={{
            fontSize: "3rem",
            color: "#a78bfa",
            marginBottom: "16px",
            filter: "drop-shadow(0 0 8px #be185d80)",
          }}
        />
        <h1 className={styles.retro404}>404</h1>
        <p className={styles.retroText}>Oops! Algo deu errado.</p>
        <p className={styles.retroText}>
          Desculpe, não encontramos esta página.
        </p>
        <div className={styles.notfoundActions}>
          {/* A classe do Link agora é a do botão estilizado do module.css */}
          <Link to="/" className={styles.btnRetroHome}>
            <FaHome className="me-2" style={{ fontSize: "1.3rem" }} />
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  </div>
);

export default NotFoundPage;
