import React, { useState, useEffect } from "react";
import { Play, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ToastContainer } from "react-toastify";

import zeldaCover from "../../assets/zelda-wallpaper.jpg";
import Newsletter from "../../components/newsletter/Newsletter";
import ProductGrid from "../../components/ProductShowCase/ProductsShowCase";
import ButtonRandomizer from "../../components/buttonRandomizer/ButtonRandomizer";
import styles from "./home.module.css";

const Hero = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch("http://localhost:4500/games/24");
        if (!response.ok)
          throw new Error("Produto em destaque não encontrado.");
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

  const formattedPrice = featuredProduct
    ? `R$ ${Number(featuredProduct.price).toFixed(2).replace(".", ",")}`
    : "";

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Reviva os Clássicos</h1>
              <p className={styles.heroSubtitle}>
                Descubra a maior coleção de jogos retrô dos anos 2000-2010.
                Nostalgia em pixels!
              </p>
            </div>

            <div
              className={styles.heroButtons}
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
            >
              <Link to={"/produtos"} className={styles.buttonPrimary}>
                <Play className={styles.icon} />
                Explorar Jogos
              </Link>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.value} style={{ color: "#60a5fa" }}>
                  100+
                </div>
                <div className={styles.label}>Jogos</div>
              </div>

              <div className={styles.stat}>
                <div className={styles.value} style={{ color: "#a78bfa" }}>
                  7
                </div>
                <div className={styles.label}>Consoles</div>
              </div>

              <div className={styles.stat}>
                <div className={styles.value} style={{ color: "#ec4899" }}>
                  50K+
                </div>
                <div className={styles.label}>Gamers</div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            {isLoading ? (
              <p>Carregando destaque...</p>
            ) : featuredProduct ? (
              <div className={styles.featuredCard}>
                <div className={styles.featuredBadge}>
                  <Star className={styles.icon} />
                  Destaque
                </div>

                <div className={styles.featuredPreview}>
                  <img
                    src={featuredProduct.imageUrl || zeldaCover}
                    alt={featuredProduct.title}
                    className={styles.featuredImage}
                  />
                </div>

                <div className={styles.featuredInfo}>
                  <div>
                    <h3>{featuredProduct.title}</h3>
                    <p>{featuredProduct.genre}</p>
                  </div>
                  <div className="text-right">
                    <div className={styles.price}>
                      <div className={styles.current}>{formattedPrice}</div>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.buttonBuy}
                  onClick={() => {
                    addToCart(
                      {
                        id: featuredProduct.id,
                        name: featuredProduct.title,
                        price: featuredProduct.price,
                        category: featuredProduct.genre,
                        imageUrl: featuredProduct.imageUrl,
                        stock: featuredProduct.stock,
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
      <ToastContainer />
    </section>
  );
};

export default Hero;
