import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";
import { useParams, useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const Products = () => {
  // 2. Novos estados para gerenciar os dados da API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPagination, setCurrentPagination] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const numberProductsPerPage = 10; // Mantemos isso para enviar à API

  const { category: currentCategory } = useParams();
  const navigate = useNavigate();

  // 3. O useEffect principal para buscar os produtos
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      const categoryParam = currentCategory ? `&genre=${currentCategory}` : "";
      const searchParam = searchTerm ? `&search=${searchTerm}` : "";

      const url = `http://localhost:4500/games?page=${currentPagination}&limit=10${categoryParam}${searchParam}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao carregar os produtos.");
        }
        const data = await response.json();
        setProducts(data.games);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [currentCategory, currentPagination, searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPagination(1); // Importante: volta para a primeira página ao fazer uma nova busca
  };

  // (Opcional, mas recomendado) useEffect para buscar as categorias apenas uma vez
  useEffect(() => {
    const fetchCategories = async () => {
      // Crie um endpoint no backend que retorne todas as categorias/gêneros únicos
      // Ex: GET http://localhost:4500/games/genres
      try {
        const response = await fetch("http://localhost:4500/games/genres");
        const data = await response.json();
        setCategories(["Todos", ...data]); // Adiciona "Todos" no início
      } catch (err) {
        console.error("Falha ao buscar categorias:", err);
        // Se falhar, você pode usar uma lista estática como fallback
        const fallbackCategories = [
          "Todos",
          "Ação",
          "RPG",
          "Aventura" /* ... */,
        ];
        setCategories(fallbackCategories);
      }
    };
    fetchCategories();
  }, []); // [] significa que roda apenas uma vez
  const handleSearchChange = (newQuery) => {
    setSearchTerm(newQuery);
    setCurrentPagination(1); // Sempre volta para a primeira página ao buscar
  };
  const selectPaginationItem = (pageNumber) => {
    setCurrentPagination(pageNumber);
  };

  // 5. A lógica de paginação agora usa o total de páginas vindo da API
  let itemsPagination = [];
  for (let number = 1; number <= totalPages; number++) {
    itemsPagination.push(
      <Pagination.Item
        key={number}
        active={number === currentPagination}
        onClick={() => selectPaginationItem(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Define a categoria ativa com base na URL
  const selectedCategory = currentCategory || "Todos";

  return (
    <div className="products-page-container">
      <ToastContainer />
      <div className="container">
        <aside className="sidebar-content">
          <h2>
            Clássicos Retrô em Evidência
          </h2>
          <p>
            Mergulhe na nostalgia dos videogames com jogos lançados até o ano de
            2010.
          </p>
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? "active"
                    : ""
                }
                onClick={() => {
                  navigate(
                    category === "Todos" ? "/produtos" : `/produtos/${category}`
                  );
                  setCurrentPagination(1); // Reseta para a primeira página ao mudar de categoria
                }}
                aria-label={category}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <main className="main-content">
          {isLoading ? (
            <p>Carregando produtos...</p>
          ) : error ? (
            <p>Erro: {error}</p>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.title,
                      price: product.price,
                      category: product.genre,
                      imageUrl: product.imageUrl,
                      stock: product.stock
                    }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-items">
                    <Pagination className="m-0">{itemsPagination}</Pagination>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
