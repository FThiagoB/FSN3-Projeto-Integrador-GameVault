import React, { useState } from "react";
import "./ButtonRandomizer.css";
import ProductCard from "../ProductCard/ProductCard";

export default function ButtonRandomizer() {
  const [randomGame, setRandomGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado de loading para o botão

  // A função agora é assíncrona para fazer a chamada à API
  const handleRandomize = async () => {
    setIsLoading(true);
    setRandomGame(null); // Limpa o jogo anterior
    try {
      const response = await fetch("http://localhost:4500/games/random");
      if (!response.ok) {
        console.log(response)
        throw new Error("Não foi possível sortear um jogo.");
      }
      const game = await response.json();
      setRandomGame(game);
    } catch (error) {
      console.error(error);
      // Aqui você poderia mostrar uma notificação de erro
    } finally {
      setIsLoading(false);
    }
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
            <button
              className="btn-randomize"
              onClick={handleRandomize}
              disabled={isLoading} // Desabilita o botão durante o carregamento
            >
              {isLoading ? "Sorteando..." : "Me surpreenda!"}
            </button>

            {/* O objeto 'randomGame' já vem pronto da API */}
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
