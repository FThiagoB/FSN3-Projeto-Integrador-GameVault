import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css"; // Importando o CSS dedicado

// O componente agora recebe o valor da busca (searchTerm) e a função para ser chamada a cada mudança (onSearchChange)
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    // Mudamos de <form> para <div> pois não precisamos mais do evento de submit
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar jogos..."
        value={searchTerm} // O valor do input é controlado pelo componente pai
        onChange={(e) => onSearchChange(e.target.value)} // Chama a função do pai a cada tecla digitada
      />
      <button
        type="button" // "button" para não tentar submeter o formulário
        className="search-bar__button"
        aria-label="Buscar"
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
