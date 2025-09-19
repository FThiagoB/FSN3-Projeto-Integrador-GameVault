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

  // 2. Criamos três estados para gerenciar os dados da API
  const [product, setProduct] = useState(null); // Para guardar o jogo encontrado
  const [isLoading, setIsLoading] = useState(true); // Para saber se a busca está em andamento
  const [error, setError] = useState(null); // Para guardar qualquer erro que ocorra

  const { addToCart } = useCart();

  // 3. O useEffect fará a chamada à API
  useEffect(() => {
    // Definimos uma função assíncrona dentro do useEffect
    const fetchProduct = async () => {
      try {
        // A URL agora aponta para o seu backend, buscando um jogo pelo ID
        const response = await fetch(`http://localhost:4500/games/${id}`);

        if (!response.ok) {
          throw new Error("Não foi possível encontrar o produto.");
        }

        const data = await response.json();
        setProduct(data); // Armazenamos o jogo no estado 'product'
      } catch (err) {
        setError(err.message); // Armazenamos a mensagem de erro no estado 'error'
      } finally {
        setIsLoading(false); // Finaliza o estado de carregamento, com sucesso ou erro
      }
    };

    fetchProduct(); // Executamos a função
  }, [id]); // O array [id] faz com que o useEffect rode de novo se o ID na URL mudar

  // Garante que vá para o início ao transicionar
  window.scrollTo(0, 0);

  const incrementQuantity = () =>
    setQuantity(quantity < 99 ? quantity + 1 : quantity);
  const decrementQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : quantity);

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
    <Container fluid className="m-0 p-0 w-100 h-100" id="page-product-info">
      {/* O resto do seu JSX permanece o mesmo */}
      <Container
        fluid
        id="product-detail"
        className="d-flex flex-column justify-content-center flex-md-row gap-1 gap-md-3 p-3"
      >
        <ToastContainer />
        <Container
          fluid
          className="m-0 p-0 w-100 d-flex flex-column justify-content-center align-items-center"
        >
          <div className="w-100 d-flex justify-content-end">
            <div className="w-100 mx-4">
              <Breadcrumb
                className="p-0 my-0 mx-auto d-flex justify-content-center"
                style={{ height: "20px", "font-size": "10px" }}
              >
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/produtos">Produtos</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`/produtos/${product.category}`}>
                    {product.category}
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div id="product-category-tag">
              <Link
                to={`/produtos/${product.category}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {product.category}
              </Link>
            </div>
          </div>
          <Image
            src={product.imageUrl}
            className="border border-dark"
            id="product-image"
            alt={product.name}
          />
        </Container>
        <Container fluid className="d-flex flex-column" id="product-side">
          <h1 className="display-5 fs-4" id="product-title">
            {product.name}
          </h1>
          <Container id="product-description" className="m-0 p-0">
            {product.description}
          </Container>
          <Container
            fluid
            className="m-auto text-center d-flex flex-column gap-2 mt-4 mt-md-0"
            id="shopping-info"
          >
            <h3 className="product-price">
              R$ {String(Number(product.price).toFixed(2)).replace(".", ",")}
            </h3>
            <Container
              flex
              className="d-flex flex-row justify-content-center gap-3"
            >
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
                className="fs-5"
                onClick={() => {
                  addToCart(product, quantity);
                  setQuantity(1);
                  notifySuccess("Item adicionado ao carrinho.");
                }}
              >
                Adicionar ao carrinho
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

export default ProductDetail;
