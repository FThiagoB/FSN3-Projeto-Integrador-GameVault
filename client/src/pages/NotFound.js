import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import "../styles/Notfound.css";

const NotFoundPage = () => (
  <div className="notfound-retro">
    <main id="content" className="notfound-main">
      <div className="notfound-content">
        <FaExclamationTriangle
          style={{
            fontSize: "3rem",
            color: "#a78bfa",
            marginBottom: "16px",
            filter: "drop-shadow(0 0 8px #be185d80)",
          }}
        />
        <h1 className="retro-404">404</h1>
        <p className="retro-text">Oops! Algo deu errado.</p>
        <p className="retro-text">Desculpe, não encontramos esta página.</p>
        <div className="notfound-actions">
          {/* A classe do Link agora é apenas a do botão estilizado */}
          <Link to="/" className="btn-retro-home">
            <FaHome className="me-2" style={{ fontSize: "1.3rem" }} />
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  </div>
);

export default NotFoundPage;
