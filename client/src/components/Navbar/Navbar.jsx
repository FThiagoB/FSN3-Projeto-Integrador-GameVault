import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const debounceTimer = setTimeout(() => {
      const fetchGames = async () => {
        setIsLoading(true);
        setSearchResults([]);
        try {
          const url = `http://localhost:4500/games?search=${searchTerm}`;
          const response = await fetch(url);
          if (!response.ok) {
            const mockData = [
              { id: 1, title: `Jogo relacionado a "${searchTerm}" 1` },
              { id: 2, title: `Outro jogo de "${searchTerm}"` },
              { id: 3, title: `Melhor jogo sobre "${searchTerm}"` },
            ].slice(0, Math.floor(Math.random() * 4));
            console.warn("API falhou. Usando dados mocados.");
            setSearchResults(mockData);
          } else {
            const data = await response.json();
            setSearchResults(data.games || []);
          }
        } catch (error) {
          console.error("Erro ao buscar jogos:", error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchGames();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // CSS embutido para evitar problemas de importação e modularizar o estilo

  return (
    <header className="admin-navbar">
      <Link to="/" className="admin-navbar-title-link">
        <h1 className="admin-navbar-title">RETRO</h1>
      </Link>
      <div className="admin-navbar-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar jogos..."
            className="admin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(isLoading ||
            searchResults.length > 0 ||
            (searchTerm && !isLoading)) && (
            <ul className="search-results-list">
              {isLoading && <li className="search-info-item">Buscando...</li>}
              {!isLoading &&
                searchResults.length > 0 &&
                searchResults.map((game) => (
                  <li key={game.id} className="search-result-item">
                    <a href={`/produto/${game.id}`} onClick={handleResultClick}>
                      {game.title}
                    </a>
                  </li>
                ))}
              {!isLoading && searchResults.length === 0 && searchTerm && (
                <li className="search-info-item">Nenhum jogo encontrado.</li>
              )}
            </ul>
          )}
        </div>
        <div
          className="admin-profile-icon"
          onClick={() => setShowOptions(!showOptions)}
        >
          SR
        </div>
        {showOptions && (
          <div className="admin-profile-options">
            <ul className="admin-profile-options-list">
              <li>
                <Link to="/profile" onClick={() => setShowOptions(false)}>
                  Perfil
                </Link>
              </li>
              <li>
                <Link to="/settings" onClick={() => setShowOptions(false)}>
                  Configurações
                </Link>
              </li>
              <li>
                <Link to="/logout" onClick={() => setShowOptions(false)}>
                  Sair
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
