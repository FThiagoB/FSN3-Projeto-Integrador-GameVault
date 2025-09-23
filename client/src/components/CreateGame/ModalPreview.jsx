import "./../../pages/Product/Products.css";
import "./ModalPreview.css";

import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";

import {
  ButtonGroup,
  Button,
  Container,
  Image,
  Breadcrumb,
} from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";

function ModalPreview({product}) {

  // Se tudo deu certo, o JSX abaixo é renderizado com os dados da API
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center breadcrumb-container"
      id="page-product-info"
    >
      <Container
        fluid
        id="product-detail"
      >

        {/* Imagem */}
        <div className="product-image-wrapper">
          <div id="product-category-tag">
            <Link
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
          className="d-flex flex-column justify-content-start "
          id="product-side"
        >
          <Breadcrumb className="p-0 my-2 breadcrumb-no-wrap" style={{ fontSize: "12px" }}>
            <Breadcrumb.Item>
              <Link>Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link>Produtos</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link>{product.genre}</Link>
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
              R$ {String(product.price.toFixed(2)).replace(".", ",")}
            </h3>

            <div className="d-flex flex-lg-row justify-content-center gap-3">
              <ButtonGroup aria-label="Quantity Control" id="control-quantity">
                <Button variant="light" >
                  -
                </Button>
                <span>{String(1).padStart(2, "0")}</span>
                <Button variant="light">
                  +
                </Button>
              </ButtonGroup>
              <Button
                className="btn-add-cart"
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

export default ModalPreview;
