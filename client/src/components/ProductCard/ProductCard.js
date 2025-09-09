import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../../contexts/CartContext";
import { Button } from "react-bootstrap";

import { toast } from "react-toastify";

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

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="product-card">
      <div className="product-category-tag">
        <Link
          to={`/produtos/${product.category}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {product.category}
        </Link>
      </div>
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p
          className="product-price"
          style={{ fontFamily: "Press Start 2P", fontSize: "1.2rem" }}
        >
          R${product.price}
        </p>
        <div
          className="product-actions"
          style={{ width: "100%", maxHeight: "30%", borderRadius: "10px" }}
        >
          <Button
            as={Link}
            to={`/produto/${product.id}`}
            variant="dark"
            className="btn-card"
          >
            Ver Detalhes
          </Button>
          <Button
            className="btn-card-secondary"
            onClick={() => {
              addToCart(product, 1);
              notifySuccess("Item adicionado ao carrinho.");
            }}
          >
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
