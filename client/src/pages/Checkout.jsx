import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaCheckCircle,
  FaLock,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaTrash,
} from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../styles/Checkout.css";
const CheckoutPage = () => {
  // Estados para endereço
  const [firstName, setFirstName] = useState("Jhon");
  const [lastName, setLastName] = useState("Doe");
  const [address, setAddress] = useState("Rua Exemplo, 123, Bairro Exemplo");
  const [city, setCity] = useState("Fortaleza");
  const [state, setState] = useState("Ceará");
  const [zip, setZip] = useState("60000-000");
  const [complement, setComplement] = useState("Apto 101");

  const redirect = useNavigate();

  //contexto carrinho
  const { clearCart: contextClearCart } = useCart();

  // Estados para pagamento
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456");
  const [expDate, setExpDate] = useState("01/33");
  const [cvv, setCvv] = useState("324");
  const [cardName, setCardName] = useState("John Doe");
  const [installments, setInstallments] = useState("1x sem juros");

  // Acessar o carrinho do contexto
  const { cartItems, removeItem, updateQuantity } = useCart();

  // Calcular totais
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const frete = 19.9;
  const desconto = 50.0;
  const impostos = 35.82;
  const total = subtotal + frete - desconto + impostos;

  const handleBuy = () => {
    notifySuccess("Compra realizada com sucesso!");
    contextClearCart();
    setTimeout(() => {
      redirect("/");
    }, 2500);
  };
  const notifySuccess = (Mensagem) =>
    toast.success(Mensagem, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  return (
    <div
      className="checkout-page"
      style={{ minHeight: "100vh", padding: "2rem 0" }}
    >
      <ToastContainer Mensagem="Compra realizada com sucesso!" />
      {/* Círculos animados no fundo */}
      <div className="hero-bg">
        <div className="hero-circle-1"></div>
        <div className="hero-circle-2"></div>
        <div className="hero-circle-3"></div>
      </div>

      <Container className="position-relative" style={{ zIndex: 10 }}>
        <Row>
          {/* Coluna Esquerda - Produtos do Carrinho */}
          <Col lg={5} className="mb-4 mb-lg-0">
            <div
              className="p-4 rounded shadow featured-card"
              style={{ minHeight: "30%", maxHeight: "100%" }}
            >
              <h2
                className="text-white fw-bold title-retro text-center mb-4"
                style={{ fontSize: "2rem" }}
              >
                Sua compra
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-light text-center">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center border-bottom border-secondary pb-3"
                      style={{ borderColor: "rgba(75, 85, 99, 0.5)" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                        }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <h5 className="text-white mb-1">{item.name}</h5>
                        <p className="text-light mb-0">
                          R$ {Number(item.price).toFixed(2)}
                        </p>
                        <div className="d-flex align-items-center mt-1">
                          <span className="text-light me-2">Qtd:</span>
                          <Form.Select
                            size="sm"
                            className="bg-gray-700 text-white border-secondary"
                            style={{ width: "70px" }}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="text-white fw-bold">
                          R$ {(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="button-delete"
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resumo do Carrinho */}
              <div
                className="mt-4"
                style={{ borderColor: "rgba(75, 85, 99, 0.5)" }}
              >
                <div
                  className="d-flex justify-content-between my-3 border-bottom pb-2"
                  style={{ borderColor: "rgba(75, 85, 99, 0.5)" }}
                >
                  <span className="text-light">Subtotal:</span>
                  <span className="text-light">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div
                  className="d-flex justify-content-between mt-2 border-bottom pb-2"
                  style={{ borderColor: "rgba(75, 85, 99, 0.5)" }}
                >
                  <span className="text-light">Itens:</span>
                  <span className="text-light">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                </div>
              </div>
              <div className="text-center mt-4">
                <Link className="mx-2 btn button-secondary" to="/cart">
                  Voltar ao carrinho
                </Link>
                <Link className="mx-2 btn button-primary" to="/produtos">
                  Voltar aos jogos
                </Link>
              </div>
            </div>
          </Col>

          {/* Coluna Direita - Formulário de Checkout */}
          <Col lg={7}>
            <div className="p-4 rounded shadow featured-card">
              <h1
                className="text-white mb-4 text-center title-retro"
                style={{ fontSize: "2.5rem" }}
              >
                <span className="gradient">Finalizar</span> Compra
              </h1>

              {/* Endereço de Entrega */}
              <div className="mb-5">
                <h2 className="text-white mb-3 d-flex align-items-center fw-bold">
                  <FaMapMarkerAlt className="me-2 text-purple" /> Endereço de
                  Entrega
                </h2>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="first_name">
                      <Form.Label className="text-light">Nome</Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="Seu nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="last_name">
                      <Form.Label className="text-light">Sobrenome</Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="Seu sobrenome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="address" className="mb-3">
                  <Form.Label className="text-light">Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-gray-700 text-white border-secondary"
                    placeholder="Rua, número, bairro"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="city">
                      <Form.Label className="text-light">Cidade</Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="Sua cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="state">
                      <Form.Label className="text-light">Estado</Form.Label>
                      <Form.Select
                        className="bg-gray-700 text-white border-secondary"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option>Ceará</option>
                        <option>São Paulo</option>
                        <option>Rio de Janeiro</option>
                        <option>Minas Gerais</option>
                        <option>Rio Grande do Sul</option>
                        <option>Santa Catarina</option>
                        <option>Paraná</option>
                        <option>Bahia</option>
                        <option>Pernambuco</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="zip">
                      <Form.Label className="text-light">CEP</Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="00000-000"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="complement">
                      <Form.Label className="text-light">
                        Complemento
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="Apto, bloco, etc"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Informações de Pagamento */}
              <div>
                <h2 className="text-white mb-3 d-flex align-items-center fw-bold">
                  <FaCreditCard className="me-2 text-blue" /> Informações de
                  Pagamento
                </h2>

                <Form.Group controlId="card_number" className="mb-3">
                  <Form.Label className="text-light">
                    Número do Cartão
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      className="bg-gray-700 text-white border-secondary"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                      <FaCreditCard className="fs-4 text-light" />
                    </div>
                  </div>
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="exp_date">
                      <Form.Label className="text-light">Validade</Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="MM/AA"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="cvv">
                      <Form.Label className="text-light">CVV</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          className="bg-gray-700 text-white border-secondary"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                          <FaQuestionCircle
                            className="text-light"
                            title="Código de 3 dígitos no verso do cartão"
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="card_name">
                      <Form.Label className="text-light">
                        Nome no Cartão
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="bg-gray-700 text-white border-secondary"
                        placeholder="Como no cartão"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="installments">
                      <Form.Label className="text-light">Parcelas</Form.Label>
                      <Form.Select
                        className="bg-gray-700 text-white border-secondary"
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                      >
                        <option>1x sem juros</option>
                        <option>2x sem juros</option>
                        <option>3x sem juros</option>
                        <option>4x sem juros</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Resumo do Pedido */}
              <div className="mt-5 pt-3 border-top border-secondary">
                <h3 className="text-white mb-3 fw-bold">Resumo do Pedido</h3>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-light">Subtotal:</span>
                  <span className="text-light">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-light">Frete:</span>
                  <span className="text-light">R$ {frete.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-light">Desconto:</span>
                  <span className="text-success">
                    - R$ {desconto.toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-light">Impostos:</span>
                  <span className="text-light">R$ {impostos.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fs-5 fw-bold py-3 border-top border-bottom border-secondary">
                  <span className="text-white">Total:</span>
                  <span className="text-white gradient-text">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                className="mt-5 d-flex justify-content-center align-items-center button-buy fw-bold"
                variant="success"
                size="lg"
                disabled={cartItems.length === 0}
                onClick={() => handleBuy()}
              >
                Finalizar Compra <FaCheckCircle className="ms-2" />
              </div>

              <div className="mt-4 text-center">
                <p className="text-light small d-flex align-items-center justify-content-center">
                  <FaLock className="me-2 text-blue" />
                  Suas informações estão protegidas com criptografia SSL
                </p>
                <div className="d-flex justify-content-center gap-3 mt-2">
                  <FaCcVisa className="fs-2 text-light" />
                  <FaCcMastercard className="fs-2 text-light" />
                  <FaCcAmex className="fs-2 text-light" />
                  <FaCcPaypal className="fs-2 text-light" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;
