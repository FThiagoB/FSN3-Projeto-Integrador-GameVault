import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./productsShowCase.module.css";
import { Link } from "react-router-dom";

const ProductGrid = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        const response = await fetch(
          "http://localhost:4500/games?limit=9&orderby=asc"
        );
        if (!response.ok) {
          throw new Error("Não foi possível carregar os jogos em destaque.");
        }
        const data = await response.json();
        setFeaturedGames(data.games);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  if (isLoading) {
    return <p>Carregando jogos em destaque...</p>;
  }

  if (error) {
    return <p>Erro ao carregar: {error}</p>;
  }

  return (
    <section className={styles.productGridSection}>
      <div className={styles.productGridContainer}>
        <div className={styles.productGridHeader}>
          <h2 className={styles.productGridTitle}>
            Veja alguns clássicos retrô em evidência
          </h2>
          <p className={styles.productGridSubtitle}>
            Reviva os melhores momentos da história dos videogames com nossa
            seleção especial de títulos icônicos dos anos 2000-2010.
          </p>
        </div>

        <div className={styles.productGridList}>
          {featuredGames.map((game) => (
            <ProductCard
              key={game.id}
              product={{
                id: game.id,
                name: game.title,
                category: game.genre,
                price: game.price,
                imageUrl: game.imageUrl,
                stock: game.stock,
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.contentBtn}>
        <Link to={"/produtos"} className={styles.buttonPrimary}>
          Ver todos
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
