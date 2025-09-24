import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./navbar.module.css"; // CSS Module

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { user, logout } = useAuth();

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

  return (
    <header className={styles.adminNavbar}>
      <Link to="/" className={styles.adminNavbarTitleLink}>
        <h1 className={styles.adminNavbarTitle}>RETRO</h1>
      </Link>
      <div className={styles.adminNavbarControls}>
        {(!user || (user && user.role === "user")) && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar jogos..."
              className={styles.adminSearchInput}
              id="search-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="no-autofill"
            />
            {(isLoading ||
              searchResults.length > 0 ||
              (searchTerm && !isLoading)) && (
              <ul className={styles.searchResultsList}>
                {isLoading && (
                  <li className={styles.searchInfoItem}>Buscando...</li>
                )}
                {!isLoading &&
                  searchResults.length > 0 &&
                  searchResults.map((game) => (
                    <li key={game.id} className={styles.searchResultItem}>
                      <a
                        href={`/produto/${game.id}`}
                        onClick={handleResultClick}
                      >
                        {game.title}
                      </a>
                    </li>
                  ))}
                {!isLoading && searchResults.length === 0 && searchTerm && (
                  <li className={styles.searchInfoItem}>
                    Nenhum jogo encontrado.
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        {user && (
          <>
            <img
              src={user.imageUrl}
              className={styles.adminProfileIcon}
              onClick={() => setShowOptions(!showOptions)}
            />
            {showOptions && (
              <div className={styles.adminProfileOptions}>
                <ul className={styles.adminProfileOptionsList}>
                  <li>
                    <Link to="/profile" onClick={() => setShowOptions(false)}>
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        setShowOptions(false);
                        logout();
                      }}
                    >
                      Sair
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
