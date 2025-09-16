import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css"; // Importando o CSS dedicado

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar jogos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-bar__button" aria-label="Buscar">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
