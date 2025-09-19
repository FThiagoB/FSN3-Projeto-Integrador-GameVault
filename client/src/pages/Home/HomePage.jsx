import React, { useState, useEffect } from "react"; // Importe useState e useEffect
import { Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// 1. CORRIJA O CAMINHO DA IMAGEM
// Se a pasta 'pages' e 'assets' estão dentro de 'src', você precisa subir dois níveis
import zeldaCover from "../../assets/zelda-wallpaper.jpg";
import Newsletter from "../../components/newsletter/Newsletter";
import ProductGrid from "../../components/ProductShowCase/ProductsShowCase";
import ButtonRandomizer from "../../components/buttonRandomizer/ButtonRandomizer";
import "./Home.css";

const Hero = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 3. CRIE ESTADOS PARA O PRODUTO EM DESTAQUE
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. BUSQUE O PRODUTO EM DESTAQUE NA API
  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        // Vamos buscar um jogo específico (ex: ID 1) para ser o destaque
        const response = await fetch("http://localhost:4500/games/3");
        if (!response.ok) {
          throw new Error("Produto em destaque não encontrado.");
        }
        const data = await response.json();
        setFeaturedProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  // Formata o preço para sempre ter duas casas decimais
  const formattedPrice = featuredProduct
    ? `R$ ${Number(featuredProduct.price).toFixed(2).replace(".", ",")}`
    : "";

  return (
    <section className="hero-section">
      <ToastContainer />
      <div className="hero-bg">
        <div className="hero-circle-1"></div>
        <div className="hero-circle-2"></div>
        <div className="hero-circle-3"></div>
      </div>

      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-left">
            {/* Coluna Esquerda */}

            <div className="hero-left">
              <div className="hero-text">
                <h1 className="hero-title title-retro">
                  <span className="gradient">Reviva</span>

                  <br />

                  <span>os Clássicos</span>
                </h1>

                <p className="hero-subtitle">
                  Descubra a maior coleção de jogos retrô dos anos 2000-2010.
                  Nostalgia em pixels!
                </p>
              </div>

              {/* Botões */}

              <div
                className="hero-buttons"
                style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
              >
                <Link to={"/produtos"} className="button-primary">
                  <Play className="icon" />
                  Explorar Jogos
                </Link>

                {/* <Link to={"/ofertas"} className="button-secondary">

Ver Ofertas

</Link> */}
              </div>

              {/* Estatísticas */}

              <div className="stats">
                <div className="stat">
                  <div className="value" style={{ color: "#60a5fa" }}>
                    100+
                  </div>

                  <div className="label">Jogos</div>
                </div>

                <div className="stat">
                  <div className="value" style={{ color: "#a78bfa" }}>
                    7
                  </div>

                  <div className="label">Consoles</div>
                </div>

                <div className="stat">
                  <div className="value" style={{ color: "#ec4899" }}>
                    50K+
                  </div>

                  <div className="label">Gamers</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            {/* 5. RENDERIZE O CARD DE DESTAQUE APENAS SE OS DADOS FORAM CARREGADOS */}
            {isLoading ? (
              <p>Carregando destaque...</p>
            ) : featuredProduct ? (
              <div className="featured-card">
                <div className="featured-badge">
                  <Star className="icon" />
                  Destaque
                </div>

                <div className="featured-preview">
                  {/* Usa a imagem real do produto vinda da API */}
                  <img
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.title}
                    className="featured-image"
                  />
                </div>

                <div className="featured-info">
                  <div>
                    {/* Usa os dados reais do produto */}
                    <h3>{featuredProduct.title}</h3>
                    <p>{featuredProduct.genre}</p>
                  </div>
                  <div className="price text-right">
                    <div className="current">{formattedPrice}</div>
                  </div>
                </div>

                <button
                  className="button-buy"
                  onClick={() => {
                    // 6. ADICIONA O PRODUTO CORRETO AO CARRINHO
                    addToCart(
                      {
                        id: featuredProduct.id,
                        name: featuredProduct.title,
                        price: featuredProduct.price,
                        category: featuredProduct.genre,
                        imageUrl: featuredProduct.imageUrl,
                      },
                      1
                    );
                    navigate("/cart");
                  }}
                >
                  Comprar Agora
                </button>
              </div>
            ) : (
              <p>Não foi possível carregar o produto em destaque.</p>
            )}
          </div>
        </div>
      </div>
      <ProductGrid />
      <ButtonRandomizer />
      <Newsletter />
    </section>
  );
};

export default Hero;
