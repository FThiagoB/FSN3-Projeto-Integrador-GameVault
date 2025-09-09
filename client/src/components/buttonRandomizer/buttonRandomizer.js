import React, { useState } from "react";
import products from "../../data/products";
import randomizerGames from "../../components/randomizer/randomizerGames";
import "../../styles/buttonRandomizer.css";
import ProductCard from "../ProductCard/ProductCard";

export default function ButtonRandomizer() {
  const [randomGame, setRandomGame] = useState(null);

  const handleRandomize = () => {
    const game = randomizerGames(products);
    setRandomGame(game);
  };

  return (
    <section className="randomizer-section">
      <div className="container">
        <div className="text-center mt-4">
          <h2 className="randomizer-title">Não sabe qual jogo jogar?</h2>
          <p className="randomizer-subtitle">
            Deixe que a sorte decida por você!
          </p>
        </div>
        <div className="btn-group">
          <div className="btn-randomizer">
            <button className="btn-randomize" onClick={handleRandomize}>
              Me surpreenda!
            </button>
            {randomGame && <ProductCard product={randomGame} />}
          </div>
        </div>
      </div>
    </section>
  );
}
