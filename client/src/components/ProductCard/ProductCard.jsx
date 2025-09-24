import React from "react";
import { Link } from "react-router-dom";
import styles from "./productCard.module.css";
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
    <div className={styles.productCard}>
      <div className={styles.productCategoryTag}>
        <Link
          to={`/produtos/${product.category}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {product.category}
        </Link>
      </div>
      <img
        src={product.imageUrl}
        alt={product.name}
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p
          className={styles.productPrice}
          style={{ fontFamily: "Press Start 2P", fontSize: "1.2rem" }}
        >
          R${product.price}
        </p>
        <div className={styles.productActions}>
          <Button
            as={Link}
            to={`/produto/${product.id}`}
            variant="dark"
            className={styles.btnCard}
          >
            Ver Detalhes
          </Button>
          <Button
            className={styles.btnCardSecondary}
            onClick={() => {
              addToCart(product, 1, product.stock);
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
