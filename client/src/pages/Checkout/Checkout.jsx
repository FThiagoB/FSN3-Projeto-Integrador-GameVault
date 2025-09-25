import React, { useEffect, useState } from "react";
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
  FaBox,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";

import styles from "./checkout.module.css";

import { useCart } from "../../contexts/CartContext";
import { useAuth } from '../../contexts/AuthContext';

function formatCEP(value) {
  return value
    .replace(/(\d{5})(\d{3})/, "$1-$2")
}

// Funções de formatação movidas para fora para clareza
const formatCardNumber = (digits) => {
  const trimmed = digits.slice(0, 16);
  return trimmed.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatCardExpDate = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

const CheckoutPage = () => {
  const [cookies] = useCookies(["authToken"]);
  const { user, userAddress, syncData, loading } = useAuth();
  const redirect = useNavigate();

  const {
    tax,
    shippingMethod,
    shippingMethods,
    getShippingMethods,
    selectShippingMethodById,
    couponCode,
    clearCart: contextClearCart,
    discount,
    cartItems,
    removeItem,
    tax: impostos,
    shippingCost: frete,
  } = useCart();

  // Estados de pagamento e endereço
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [firstName, setFirstName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [complement, setComplement] = useState("");
  const [address, setAddress] = useState("");

  const [invalidFields, setInvalidFields] = useState({});

  useEffect(() => {
    if (!cartItems.length) {
      redirect("/");
    }
  }, [cartItems, redirect]);

  useEffect(() => {
    async function refreshMethodsShipping() { await getShippingMethods(); }
    if(!Object.keys(shippingMethod).length){
      console.log("Entrou")
      refreshMethodsShipping();
    }
  });

  useEffect(() => {
    setAddress(
      `${street ? street : ""} ${number ? "," + number : ""} ${neighborhood ? "," + neighborhood : ""} ${state ? "(" + state + ")" : ""}`
    );
  }, [street, neighborhood, state, number])

  const refreshFields = () => {
    setFirstName(user?.name || "");
    setStreet(userAddress.street || "");
    setNumber(userAddress.number || "");
    setNeighborhood(userAddress.neighborhood || "");
    setCity(userAddress.city || "");
    setState(userAddress.state || "");
    setZip(userAddress.zipCode || "");
    setComplement(userAddress.complemento || "");
    setAddress(
      userAddress.street
        ? `${userAddress.street}, ${userAddress.number}, ${userAddress.neighborhood} (${userAddress.state})`
        : ""
    );

    if (
      user?.paymentMethod &&
      user.paymentMethod.type === "credit_card" &&
      user.paymentMethod.data
    ) {
      const { number, expDate, name } = user.paymentMethod.data;

      setCardNumber(number || "");
      setExpDate(expDate || "");
      setCardName(name || "");
      setCvv(""); // nunca armazenado, sempre vazio
    }
  };

  useEffect(() => {
    refreshFields();
  }, [user, redirect, loading]);

  // Sincroniza as informações de endereço do usuário
  useEffect(() => {
    syncData();
    if(!Object.keys(shippingMethod).length){
      console.log("Buscando endereço")
      getShippingMethods()
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      if (!user) redirect("/login");
      else if (user.role !== "user") redirect("/profile");
    }
  }, [user, userAddress, redirect, loading, syncData]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const desconto = subtotal * discount;
  const total = subtotal + frete - desconto + impostos;

  const notifySuccess = (message) =>
    toast.success(message, { theme: "colored" });
  const notifyError = (message) => toast.error(message, { theme: "colored" });

  const handleBuy = () => {
    const fieldsToValidate = {
      street,
      number,
      neighborhood,
      city,
      state,
      zip,
      cardNumber,
      expDate,
      cvv,
      cardName,
    };

    const newInvalidFields = Object.keys(fieldsToValidate).reduce(
      (acc, key) => {
        acc[key] = !fieldsToValidate[key];
        return acc;
      },
      {}
    );

    setInvalidFields(newInvalidFields);

    if (Object.values(newInvalidFields).some(Boolean)) {
      notifyError("Preencha todos os campos obrigatórios.");
      return;
    }

    if(!Object.keys(shippingMethod).length) {
      notifyError("Selecione um método de envio válido.");
      return;
    }

    registerCheckout();
  };

  console.log({
    dados: {
      street,
      number,
      neighborhood,
      city,
      state,
      zip,
      cardNumber,
      expDate,
      cvv,
      cardName,
    },
    shippingMethod
  })
  console.log("Método de envio vazio: ", !Object.keys(shippingMethod).length)


  const registerCheckout = async () => {
    const data = {
      shippingAddress: {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode: zip,
        complemento: complement
      },
      paymentMethod: {
        type: "credit_card",
        data: {
          number: cardNumber,
          expDate: expDate,
          name: cardName,
          cvv: cvv
        }
      },
      items: cartItems,
      shippingMethod,
      couponCode,
      tax,
    };

    try {
      const response = await fetch(`http://localhost:4500/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${cookies.authToken}`,
        },
        body: JSON.stringify(data),
      });

      // Verifica se houve algum problema
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      notifySuccess("Compra realizada com sucesso, acompanhe o seu pedido")

      setTimeout(() => {
        redirect("/profile/orders");
        contextClearCart();
      }, 2500);


    }
    catch (error) {
      console.error('Erro:', error);
      notifyError(`${error}`);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className={styles.heroBg}>
        <div className={styles.heroCircle1}></div>
        <div className={styles.heroCircle2}></div>
        <div className={styles.heroCircle3}></div>
      </div>

      <Container className="position-relative" style={{ zIndex: 10 }}>
        <Row>
          {/* Coluna Esquerda */}
          <Col lg={5} className="mb-4 mb-lg-0">
            <div className={`p-4 rounded shadow ${styles.featuredCard}`}>
              <h2
                className={`text-white fw-bold text-center mb-4 ${styles.titleRetro}`}
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
                    >
                      <Image
                        src={item.imageUrl}
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
                        <span className="text-light me-2">
                          Qtd: {item.quantity}
                        </span>
                      </div>
                      <div className="text-end">
                        <p className="text-white fw-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className={styles.buttonDelete}
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <div className="d-flex justify-content-between my-3 border-bottom pb-2">
                  <span className="text-light">Subtotal:</span>
                  <span className="text-light">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mt-2 border-bottom pb-2">
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
                <Link className={`mx-2 btn ${styles.buttonPrimary}`} to="/cart">
                  Voltar ao carrinho
                </Link>
                <Link
                  className={`mx-2 btn ${styles.buttonPrimary}`}
                  to="/produtos"
                >
                  Voltar aos jogos
                </Link>
              </div>
            </div>
          </Col>

          {/* Coluna Direita */}
          <Col lg={7}>
            <div className={`p-4 rounded shadow ${styles.featuredCard}`}>
              <h1
                className={`text-white mb-4 text-center ${styles.titleRetro}`}
              >
                <span className={styles.gradient}>Finalizar</span> Compra
              </h1>

              {/* Endereço */}
              <div className="mb-5">
                <h2 className="text-white mb-3 d-flex align-items-center fw-bold">
                  <FaMapMarkerAlt className={`me-2 ${styles.textPurple}`} />{" "}
                  Endereço de Entrega
                </h2>
                {/* Campos do formulário de endereço aqui... */}
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="first_name">
                      <Form.Label className="text-light">Nome</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Seu nome"
                        value={firstName}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8} className="mb-3">
                    <Form.Group controlId="address">
                      <Form.Label className="text-light">Endereço</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Rua, número, bairro"
                        value={address}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-3">
                    <Form.Group controlId="street">
                      <Form.Label className="text-light">Rua</Form.Label>
                      <Form.Control
                        type="text"
                        className={invalidFields.street ? styles.invalid : ""}
                        placeholder="Rua são miguel"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col className="mb-3">
                    <Form.Group controlId="zip">
                      <Form.Label className="text-light">CEP</Form.Label>
                      <Form.Control
                        type="text"
                        className={invalidFields.zip ? styles.invalid : ""}
                        placeholder="00000-000"
                        value={formatCEP(zip)}
                        onChange={(e) => setZip(e.target.value.replace(/[^0-9.]/g, "").slice(0, 8))}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="number">
                      <Form.Label className="text-light">Número</Form.Label>
                      <Form.Control
                        type="text"
                        className={invalidFields.number ? styles.invalid : ""}
                        placeholder="10"
                        value={number}
                        onChange={(e) =>
                          setNumber(e.target.value.replace(/[^0-9.]/g, ""))
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8} className="mb-3">
                    <Form.Group controlId="neighborhood">
                      <Form.Label className="text-light">Bairro</Form.Label>
                      <Form.Control
                        type="text"
                        className={
                          invalidFields.neighborhood ? styles.invalid : ""
                        }
                        placeholder="Vila Lisboa"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group controlId="city">
                      <Form.Label className="text-light">Cidade</Form.Label>
                      <Form.Control
                        type="text"
                        className={invalidFields.city ? styles.invalid : ""}
                        placeholder="Fortaleza"
                        value={city}
                        onChange={(e) =>
                          setCity(e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8} className="mb-3">
                    <Form.Group controlId="neighborhood">
                      <Form.Label className="text-light">Estado</Form.Label>
                      <Form.Control
                        type="text"
                        className={
                          invalidFields.state ? styles.invalid : ""
                        }
                        placeholder="Ceará"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Pagamento */}
              <div>
                <h2 className="text-white mb-3 d-flex align-items-center fw-bold">
                  <FaCreditCard className={`me-2 ${styles.textBlue}`} />{" "}
                  Informações de Pagamento
                </h2>
                {/* Campos do formulário de pagamento aqui... */}
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="card_number" className="mb-3">
                      <Form.Label className="text-light">
                        Número do Cartão
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          className={invalidFields.cardNumber ? styles.invalid : ""}
                          placeholder="1234 5678 9012 3456"
                          value={formatCardNumber(cardNumber)}
                          onChange={(e) =>
                            setCardNumber(e.target.value.replace(/\D/g, ""))
                          }
                          required
                        />
                        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                          <FaCreditCard className="fs-4 text-light" />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="card_number" className="mb-3">
                      <Form.Label className="text-light">
                        Nome do Cartão
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          className={invalidFields.cardName ? styles.invalid : ""}
                          placeholder="João"
                          value={cardName}
                          onChange={(e) =>
                            setCardName(e.target.value)
                          }
                          required
                        />
                        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                          <FaCreditCard className="fs-4 text-light" />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="exp_date">
                      <Form.Label className="text-light">Validade</Form.Label>
                      <Form.Control
                        type="text"
                        className={invalidFields.expDate ? styles.invalid : ""}
                        placeholder="01/33"
                        value={formatCardExpDate(expDate)}
                        onChange={(e) =>
                          setExpDate(e.target.value.replace(/\D/g, ""))
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="cvv">
                      <Form.Label className="text-light">CVV</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          className={invalidFields.cvv ? styles.invalid : ""}
                          placeholder="123"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          required
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
              </div>

              {/* Entrega */}
              <div className="mt-4">
                <h2 className="text-white mb-3 d-flex align-items-center fw-bold">
                  <FaBox className={`me-2 ${styles.textBlue}`} /> Informações de
                  Entrega
                </h2>
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`${styles.shippingOption} ${shippingMethod?.id === method.id
                      ? styles.shippingOptionSelected
                      : ""
                      }`}
                    onClick={() => selectShippingMethodById(method.id)}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      id={`shippingMethod${method.id}`}
                      value={method.id}
                      checked={shippingMethod?.id === method.id}
                      readOnly
                      onChange={() => selectShippingMethodById(method.id)}
                    />
                    <label htmlFor={`shippingMethod${method.id}`}>
                      <div>
                        <div className={styles.shippingOptionName}>
                          {method.name}
                        </div>
                        <div className={styles.shippingOptionDesc}>
                          {method.description}
                        </div>
                      </div>
                      <div className={styles.shippingOptionPrice}>
                        R${method.price.toFixed(2)}
                      </div>
                    </label>
                  </div>
                ))}

              </div>

              {/* Resumo e Finalização */}
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
                {desconto > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Desconto:</span>
                    <span className="text-success">
                      - R$ {desconto.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-light">Impostos:</span>
                  <span className="text-light">R$ {impostos.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fs-5 fw-bold py-3 border-top border-bottom border-secondary">
                  <span className="text-white">Total:</span>
                  <span className={`text-white ${styles.gradientText}`}>
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div
                className={`mt-5 d-flex justify-content-center align-items-center fw-bold ${styles.buttonBuy}`}
                onClick={handleBuy}
              >
                Finalizar Compra <FaCheckCircle className="ms-2" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-light small d-flex align-items-center justify-content-center">
                  <FaLock className={`me-2 ${styles.textBlue}`} /> Suas
                  informações estão protegidas
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
