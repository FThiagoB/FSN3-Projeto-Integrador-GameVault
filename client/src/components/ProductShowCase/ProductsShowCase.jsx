import React, { useState, useEffect } from "react"; // 1. Importe useState e useEffect
import ProductCard from "../ProductCard/ProductCard";
import "./ProductsShowCase.css";
import { Link } from "react-router-dom";
// import products from "../../data/products"; // 2. Remova a importação que está causando o erro
// import RandomizerGames from "../randomizer/RandomizerGames"; // Removido se não estiver em uso

const ProductGrid = () => {
  // 3. Crie os estados para os jogos, carregamento e erro
  const [featuredGames, setFeaturedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. Use o useEffect para buscar os dados da API quando o componente montar
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        // Vamos buscar 8 jogos para usar como destaque
        const response = await fetch("http://localhost:4500/games?limit=9");
        if (!response.ok) {
          throw new Error("Não foi possível carregar os jogos em destaque.");
        }
        const data = await response.json();
        setFeaturedGames(data.games); // Armazena os jogos no estado
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []); // O array vazio [] faz com que a busca aconteça apenas uma vez

  // 5. Adicione a lógica de carregamento e erro
  if (isLoading) {
    return <p>Carregando jogos em destaque...</p>;
  }

  if (error) {
    return <p>Erro ao carregar: {error}</p>;
  }

  return (
    <section className="product-grid-section">
      <div className="product-grid-container">
        <div className="product-grid-header">
          <h2 className="product-grid-title">
            Veja alguns clássicos retrô em evidência
          </h2>
          <p className="product-grid-subtitle">
            Reviva os melhores momentos da história dos videogames com nossa
            seleção especial de títulos icônicos dos anos 2000-2010.
          </p>
        </div>

        {/* <div className="product-grid-filters">
          {["Aventura", "FPS", "RPG", "Ação", "Plataforma"].map((filter) => (
            <button key={filter} className="filter-button">
              {filter}
            </button>
          ))}
        </div> */}

        <div className="product-grid-list">
          {/* 6. Mapeie sobre o estado 'featuredGames' e passe as props corretas para ProductCard */}
          {featuredGames.map((game) => (
            <ProductCard
              key={game.id}
              product={{
                id: game.id,
                name: game.title,
                category: game.genre,
                price: game.price,
                imageUrl: game.imageUrl, // A URL completa que vem da API
              }}
            />
          ))}
        </div>
      </div>
      <div class="content-btn">
        <Link to={"/produtos"} className="button-primary">
          Ver todos
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
