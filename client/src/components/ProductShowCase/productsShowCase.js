import ProductCard from "../ProductCard/ProductCard";
import "../../styles/productsShowCase.css"; // importa o CSS externo
import products from "../../data/products";
import RandomizerGames from "../randomizer/randomizerGames";

const ProductGrid = () => {
  const featuredGames = [
    {
      id: "1",
      title: "The Legend of Zelda: Wind Waker",
      console: "GameCube",
      year: 2003,
      price: 89.9,
      originalPrice: 129.9,
      rating: 4.9,
      image:
        "https://upload.wikimedia.org/wikipedia/en/d/d1/Sled_Storm_%281999%29_Coverart.png",
      genre: "Aventura",
      isWishlisted: true,
    },
    {
      id: "2",
      title: "Doom 3",
      console: "Xbox Original",
      year: 2005,
      price: 59.9,
      originalPrice: 79.9,
      rating: 4.5,
      image:
        "https://upload.wikimedia.org/wikipedia/en/8/84/Pok%C3%A9mon_Crystal_box_art.png",
      genre: "FPS",
    },
    {
      id: "3",
      title: "Tomb Raider: Legend",
      console: "PlayStation 2",
      year: 2006,
      price: 49.9,
      rating: 4.3,
      image:
        "https://upload.wikimedia.org/wikipedia/pt/7/7e/God_of_War_2_capa.png",
      genre: "Ação",
    },
    {
      id: "4",
      title: "Pokémon Diamond",
      console: "Nintendo DS",
      year: 2007,
      price: 159.9,
      originalPrice: 199.9,
      rating: 4.8,
      image: "https://upload.wikimedia.org/wikipedia/pt/c/c1/Dmc3.png",
      genre: "RPG",
      isWishlisted: true,
    },
    {
      id: "5",
      title: "Grand Theft Auto: Vice City",
      console: "PlayStation 2",
      year: 2002,
      price: 39.9,
      rating: 4.7,
      image:
        "https://upload.wikimedia.org/wikipedia/pt/6/66/ShadowOfTheColossusGH.jpg",
      genre: "Ação",
    },
    {
      id: "6",
      title: "Super Mario 64 DS",
      console: "Nintendo DS",
      year: 2004,
      price: 129.9,
      rating: 4.6,
      image:
        "https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg",
      genre: "Plataforma",
    },
    {
      id: "7",
      title: "Halo 2",
      console: "Xbox Original",
      year: 2004,
      price: 69.9,
      originalPrice: 99.9,
      rating: 4.8,
      image: "https://upload.wikimedia.org/wikipedia/en/b/b3/Mgs3box.jpg",
      genre: "FPS",
    },
    {
      id: "8",
      title: "Final Fantasy X",
      console: "PlayStation 2",
      year: 2001,
      price: 79.9,
      rating: 4.9,
      image:
        "https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg",
      genre: "RPG",
    },
  ];

  return (
    <section className="product-grid-section">
      <div className="product-grid-container">
        {/* Section Header */}
        <div className="product-grid-header">
          <h2 className="product-grid-title">
            <span className="text-glow">Clássicos</span> em Destaque
          </h2>
          <p className="product-grid-subtitle">
            Reviva os melhores momentos da história dos videogames com nossa
            seleção especial de títulos icônicos dos anos 2000
          </p>
        </div>

        {/* Filter Badges */}
        <div className="product-grid-filters">
          {["Aventura", "FPS", "RPG", "Ação", "Plataforma"].map((filter) => (
            <button key={filter} className="filter-button">
              {filter}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="product-grid-list">
          {featuredGames.map((game) => (
            <ProductCard key={game.id} product={products[game.id]} />
          ))}
        </div>

        {/* Load More Button */}
      </div>
    </section>
  );
};

export default ProductGrid;
