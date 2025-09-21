import "./Products.css";

import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

import {
  ButtonGroup,
  Button,
  Container,
  Image,
  Breadcrumb,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const notifySuccess = (Mensagem) =>
  toast.info(Mensagem, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams(); // Pegamos o ID da URL

  // Estados para gerenciar os dados da API
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // Estado para o preço total

  const { addToCart } = useCart();

  // useEffect para buscar os dados do produto na API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4500/games/${id}`);
        if (!response.ok) {
          throw new Error("Não foi possível encontrar o produto.");
        }
        const data = await response.json();
        setProduct(data);
        setTotal(data.price); // Define o total inicial com o preço de 1 unidade
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // useEffect para calcular o total sempre que a quantidade ou o produto mudar
  useEffect(() => {
    if (product) {
      const calculatedTotal = product.price * quantity;
      setTotal(calculatedTotal);
    }
  }, [quantity, product]);

  // Garante que vá para o início ao transicionar
  window.scrollTo(0, 0);

  const incrementQuantity = () =>
    setQuantity((prevQuantity) =>
      prevQuantity < 99 ? prevQuantity + 1 : prevQuantity
    );
  const decrementQuantity = () =>
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    );

  // 4. Lógica para exibir o conteúdo com base nos novos estados
  if (isLoading) {
    return (
      <Container>
        <p>Carregando detalhes do jogo...</p>
      </Container>
    );
  }

  if (error) {
    // Se o erro for de "não encontrado" ou outro, redireciona
    return <Navigate to="/404" />;
  }

  // Se o produto não for encontrado após o carregamento, também redireciona
  if (!product) {
    return <Navigate to="/404" />;
  }

  // Se tudo deu certo, o JSX abaixo é renderizado com os dados da API
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center"
      id="page-product-info"
    >
      <Container
        fluid
        id="product-detail"
      >
        <ToastContainer />

        {/* Imagem */}
        <div className="product-image-wrapper">
          <div id="product-category-tag">
            <Link
              to={`/produtos/${product.category}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {product.genre}
            </Link>
          </div>
          <Image
            src={product.imageUrl}
            className="border border-dark"
            id="product-image"
            alt={product.name}
          />
        </div>

        {/* Informações */}
        <Container
          fluid
          className="d-flex flex-column justify-content-start"
          id="product-side"
        >
          <Breadcrumb className="p-0 my-2" style={{ fontSize: "12px" }}>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/produtos">Produtos</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/produtos/${product.genre}`}>{product.genre}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="product-title">{product.title}</h1>
          <Container id="product-description" className="m-0 p-0">
            {product.description}
          </Container>

          <Container
            fluid
            className="text-center d-flex flex-column gap-3 mt-4"
            id="shopping-info"
          >
            <h3 className="product-price">
              R$ {String(total.toFixed(2)).replace(".", ",")}
            </h3>

            <div className="d-flex flex-lg-row justify-content-center gap-3">
              <ButtonGroup aria-label="Quantity Control" id="control-quantity">
                <Button variant="light" onClick={decrementQuantity}>
                  -
                </Button>
                <span>{String(quantity).padStart(2, "0")}</span>
                <Button variant="light" onClick={incrementQuantity}>
                  +
                </Button>
              </ButtonGroup>
              <Button
                className="btn-add-cart"
                onClick={() => {
                  addToCart(product, quantity);
                  setQuantity(1);
                  notifySuccess("Item adicionado ao carrinho.");
                }}
              >
                Adicionar ao carrinho
              </Button>
            </div>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

export default ProductDetail;
