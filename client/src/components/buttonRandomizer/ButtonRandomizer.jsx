import React, { useState } from "react";
import styles from "./buttonRandomizer.module.css";
import ProductCard from "../ProductCard/ProductCard";

export default function ButtonRandomizer() {
  const [randomGame, setRandomGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomize = async () => {
    setIsLoading(true);
    setRandomGame(null);
    try {
      const response = await fetch("http://localhost:4500/games/random");
      if (!response.ok) {
        throw new Error("Não foi possível sortear um jogo.");
      }
      const game = await response.json();
      setRandomGame(game);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.randomizerSection}>
      <div className={styles.container}>
        <div className={`${styles.textCenter} ${styles.mt4}`}>
          <h2 className={styles.randomizerTitle}>Não sabe qual jogo jogar?</h2>
          <p className={styles.randomizerSubtitle}>
            Deixe que a sorte decida por você!
          </p>
        </div>

        <div className={styles.btnGroup}>
          <div className={styles.btnRandomizer}>
            <button
              className={styles.btnRandomize}
              onClick={handleRandomize}
              disabled={isLoading}
            >
              {isLoading ? "Sorteando..." : "Me surpreenda!"}
            </button>

            {randomGame && (
              <ProductCard
                product={{
                  id: randomGame.id,
                  name: randomGame.title,
                  category: randomGame.genre,
                  price: randomGame.price,
                  imageUrl: randomGame.imageUrl,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
