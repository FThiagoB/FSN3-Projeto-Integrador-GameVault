import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
  FaShoppingCart,
  FaTrash,
  FaShieldAlt,
  FaMinus,
  FaPlus,
  FaChevronLeft,
} from "react-icons/fa";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    removeItem: contextRemoveItem,
    updateQuantity: contextUpdateQuantity,
    clearCart: contextClearCart,
  } = useCart();

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const notifySuccess = (Mensagem) =>
    toast.success(Mensagem, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleCheckout = () => {
    notifySuccess("Compra realizada com sucesso!");
    contextClearCart();
  };

  // Cart operations
  const removeItem = () => {
    if (itemToRemove !== null) {
      contextRemoveItem(itemToRemove);
      notifySuccess("Item removido com sucesso!");
    }
    setShowRemoveConfirm(false);
    setItemToRemove(null);
  };

  const confirmClearCart = () => setShowClearConfirm(true);
  const confirmRemoveItem = (id) => {
    setItemToRemove(id);
    setShowRemoveConfirm(true);
  };
  const clearCart = () => {
    contextClearCart();
    setShowClearConfirm(false);
  };

  const incrementQuantity = (id, qty) => contextUpdateQuantity(id, qty + 1);
  const decrementQuantity = (id, qty) => {
    if (qty > 1) contextUpdateQuantity(id, qty - 1);
  };

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value) || 1;
    contextUpdateQuantity(id, Math.max(1, newQuantity));
  };

  const applyPromoCode = () => {
    const promoCodes = {
      SAVE10: { discount: 0.1, message: "10% discount applied!" },
      FREESHIP: {
        discount: 0,
        message: "Free shipping applied!",
        freeShipping: true,
      },
      WELCOME20: { discount: 0.2, message: "20% discount applied!" },
    };

    if (promoCode.trim() === "") {
      setPromoMessage("Please enter a promo code");
      setPromoValid(false);
      return;
    }

    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setPromoValid(true);
      setPromoMessage(promo.message);
      notifySuccess(promo.message);

      if (promo.discount) {
        setDiscount(subtotal * promo.discount);
      }

      if (promo.freeShipping) {
        setShippingMethod("standard");
      }
    } else {
      setPromoValid(false);
      setPromoMessage("Invalid promo code");
      setDiscount(0);
    }
  };

  // Order summary calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const calculateTax = () => (subtotal - discount) * 0.075;
  const tax = calculateTax();

  const shippingCost =
    { standard: 5, express: 15, overnight: 25 }[shippingMethod] || 5;

  const total = subtotal + shippingCost + tax - discount;

  return (
    <div
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(to top, #312e81, #6b21a8, #be185d)",
        color: "white",
        fontFamily: "'Press Start 2P', system-ui",
      }}
    >
      <ToastContainer />
      <div className="container py-4">
        {/* Empty Cart Message */}
        {cartItems.length === 0 && (
          <div
            className="card text-center p-4 mb-4 d-flex align-items-center justify-content-center"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "1rem",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
            }}
          >
            <FaShoppingCart
              className="fas fa-shopping-cart fs-1 mb-3"
              style={{ color: "#a78bfa" }}
            />
            <p className="fs-5" style={{ color: "#d1d5db" }}>
              Seu carrinho está vazio
            </p>
            <Link
              to="/produtos"
              className="btn mt-3 px-4 py-2"
              style={{
                background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              Continuar Comprando
            </Link>
          </div>
        )}

        {/* Mobile View */}
        <div className="d-block d-sm-none">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="mb-3"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "1rem",
                padding: "1rem",
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt="Product"
                    className="img-thumbnail me-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }}
                  />
                  <div>
                    <h5 className="mb-0" style={{ color: "white" }}>
                      {item.name}
                    </h5>
                  </div>
                </div>
                <button
                  onClick={() => confirmRemoveItem(item.id)}
                  className="btn btn-link p-0"
                  style={{ color: "#ec4899" }}
                >
                  <FaTrash size={24} />
                </button>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <span style={{ color: "#d1d5db" }}>Quantidade:</span>
                  <div className="input-group input-group-sm">
                    <FaChevronLeft
                      className="btn"
                      style={{
                        fontSize: "1rem",
                        background: "rgba(31, 41, 55, 0.5)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        color: "white",
                      }}
                      onClick={() => decrementQuantity(item.id, item.quantity)}
                    />

                    <input
                      type="number"
                      className="form-control text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      min="1"
                      style={{
                        background: "rgba(31, 41, 55, 0.5)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        color: "white",
                      }}
                    />
                    <span
                      className="btn"
                      style={{
                        fontSize: "1rem",
                        background: "rgba(31, 41, 55, 0.5)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        color: "white",
                      }}
                      onClick={() => incrementQuantity(item.id, item.quantity)}
                    >
                      +
                    </span>
                  </div>
                </div>

                <div className="col-6">
                  <span style={{ color: "#d1d5db" }}>Preço:</span>
                  <div className="fw-medium" style={{ color: "#a78bfa" }}>
                    R${Number(item.price).toFixed(2)}
                  </div>
                </div>

                <div className="col-6">
                  <span style={{ color: "#d1d5db" }}>Total:</span>
                  <div className="fw-bold" style={{ color: "#a78bfa" }}>
                    R${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet/Desktop View */}
        {cartItems.length > 0 && (
          <div className="d-none d-sm-block">
            <div
              className="table-responsive rounded-3"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              <table
                className="align-middle"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #dee2e6",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(139, 92, 246, 0.2)" }}>
                    <th scope="col" className="ps-4">
                      Produto
                    </th>
                    <th scope="col" className="text-center">
                      Quantidade
                    </th>
                    <th scope="col" className="text-end">
                      Preço
                    </th>
                    <th scope="col" className="text-end">
                      Total
                    </th>
                    <th scope="col" className="text-center pe-4">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
                      }}
                    >
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt="Product"
                            className="img-thumbnail me-3"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(139, 92, 246, 0.3)",
                            }}
                          />
                          <div>
                            <h6 className="mb-0">
                              <Link
                                to={`/produto/${item.id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "white",
                                }}
                              >
                                {item.name}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center ">
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ width: "150px", height: "40px" }}
                          >
                            <FaMinus
                              style={{
                                cursor: "pointer",
                                color: "white",
                                background: "rgba(31, 41, 55, 0.5)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                borderRadius: "0.25rem",
                                fontSize: "1rem",
                                padding: "5px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() =>
                                decrementQuantity(item.id, item.quantity)
                              }
                            />
                            <input
                              type="number"
                              className="form-control text-center"
                              style={{
                                width: "60px",
                                background: "rgba(31, 41, 55, 0.5)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                color: "white",
                              }}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              min="1"
                            />

                            <FaPlus
                              style={{
                                cursor: "pointer",
                                color: "white",
                                background: "rgba(31, 41, 55, 0.5)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                borderRadius: "0.25rem",
                                fontSize: "1rem",
                                padding: "5px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() =>
                                incrementQuantity(item.id, item.quantity)
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        <span
                          className="fw-medium"
                          style={{ color: "#a78bfa" }}
                        >
                          R${Number(item.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-end">
                        <span className="fw-bold" style={{ color: "#a78bfa" }}>
                          R${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center pe-4">
                        <button
                          onClick={() => confirmRemoveItem(item.id)}
                          className="btn btn-link p-0"
                          style={{ color: "#ec4899" }}
                        >
                          <FaTrash size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Summary Section */}
        {cartItems.length > 0 && (
          <div className="row g-4">
            <div className="col-lg-8">
              {/* Shipping Options */}
              <div
                className="mb-4 rounded-3 p-4"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                  borderRadius: "1rem",
                }}
              >
                <h5
                  className="mb-2 title-retro"
                  style={{
                    fontFamily: '"Press Start 2P", system-ui',
                    fontSize: "1.25rem",
                    textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                    color: "#a78bfa",
                  }}
                >
                  Opções de Envio
                </h5>
                <div className="vstack gap-3">
                  <div
                    className="border rounded p-3"
                    style={{
                      background:
                        shippingMethod === "standard"
                          ? "rgba(139, 92, 246, 0.2)"
                          : "transparent",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShippingMethod("standard")}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shippingMethod"
                        id="standardShipping"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label d-flex justify-content-between w-100"
                        htmlFor="standardShipping"
                        style={{ cursor: "pointer" }}
                      >
                        <div>
                          <div className="fw-medium" style={{ color: "white" }}>
                            Chave do Produto
                          </div>
                          <div className="small" style={{ color: "#d1d5db" }}>
                            Resgate uma chave exclusiva imediatamente
                          </div>
                        </div>
                        <div className="fw-medium" style={{ color: "#a78bfa" }}>
                          R$5.00
                        </div>
                      </label>
                    </div>
                  </div>

                  <div
                    className="border rounded p-3"
                    style={{
                      background:
                        shippingMethod === "express"
                          ? "rgba(139, 92, 246, 0.2)"
                          : "transparent",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShippingMethod("express")}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shippingMethod"
                        id="expressShipping"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label d-flex justify-content-between w-100"
                        htmlFor="expressShipping"
                        style={{ cursor: "pointer" }}
                      >
                        <div>
                          <div className="fw-medium" style={{ color: "white" }}>
                            Express
                          </div>
                          <div className="small" style={{ color: "#d1d5db" }}>
                            Entrega em 2-3 dias - Mídia física
                          </div>
                        </div>
                        <div className="fw-medium" style={{ color: "#a78bfa" }}>
                          R$15.00
                        </div>
                      </label>
                    </div>
                  </div>

                  <div
                    className="border rounded p-3"
                    style={{
                      background:
                        shippingMethod === "overnight"
                          ? "rgba(139, 92, 246, 0.2)"
                          : "transparent",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShippingMethod("overnight")}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shippingMethod"
                        id="overnightShipping"
                        value="overnight"
                        checked={shippingMethod === "overnight"}
                        onChange={() => setShippingMethod("overnight")}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label d-flex justify-content-between w-100"
                        htmlFor="overnightShipping"
                        style={{ cursor: "pointer" }}
                      >
                        <div>
                          <div className="fw-medium" style={{ color: "white" }}>
                            Standard
                          </div>
                          <div className="small" style={{ color: "#d1d5db" }}>
                            Entrega em 5-7 dias - Mídia física
                          </div>
                        </div>
                        <div className="fw-medium" style={{ color: "#a78bfa" }}>
                          R$25.00
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div
                className="rounded-3 p-4"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                  borderRadius: "1rem",
                }}
              >
                <h5
                  className="mb-4 title-retro"
                  style={{
                    fontFamily: '"Press Start 2P", system-ui',
                    fontSize: "1.25rem",
                    textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                    color: "#a78bfa",
                  }}
                >
                  Código Promocional
                </h5>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite SAVE10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      background: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      color: "white",
                      borderRadius: "0.5rem 0 0 0.5rem",
                    }}
                  />
                  <button
                    className="btn"
                    type="button"
                    onClick={applyPromoCode}
                    style={{
                      background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                      color: "white",
                      border: "none",
                      borderRadius: "0 0.5rem 0.5rem 0",
                      fontWeight: "bold",
                    }}
                  >
                    Aplicar
                  </button>
                </div>
                {promoMessage && (
                  <div
                    className={`mt-2 small ${
                      promoValid ? "text-success" : "text-danger"
                    }`}
                  >
                    {promoMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="col-lg-4">
              <div
                className="rounded-3 p-4"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                  borderRadius: "1rem",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                <style>
                  {`
                    @keyframes float {
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(-5px); }
                    }
                  `}
                </style>

                <h5
                  className="mb-4 title-retro"
                  style={{
                    fontFamily: '"Press Start 2P", system-ui',
                    fontSize: "1.25rem",
                    textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                    color: "#a78bfa",
                  }}
                >
                  Resumo do Pedido
                </h5>
                <ul className="list-group list-group-flush mb-3">
                  <li
                    className="list-group-item d-flex justify-content-between"
                    style={{
                      background: "transparent",
                      color: "#d1d5db",
                      borderColor: "rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>R${subtotal.toFixed(2)}</span>
                  </li>
                  <li
                    className="list-group-item d-flex justify-content-between"
                    style={{
                      background: "transparent",
                      color: "#d1d5db",
                      borderColor: "rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <span>Frete</span>
                    <span>R${shippingCost.toFixed(2)}</span>
                  </li>
                  {discount > 0 && (
                    <li
                      className="list-group-item d-flex justify-content-between"
                      style={{
                        background: "transparent",
                        color: "#34d399",
                        borderColor: "rgba(139, 92, 246, 0.2)",
                      }}
                    >
                      <span>Desconto</span>
                      <span>-R${discount.toFixed(2)}</span>
                    </li>
                  )}
                  <li
                    className="list-group-item d-flex justify-content-between"
                    style={{
                      background: "transparent",
                      color: "#d1d5db",
                      borderColor: "rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <span>Taxa</span>
                    <span>R${tax.toFixed(2)}</span>
                  </li>
                  <li
                    className="list-group-item pt-3 d-flex justify-content-between fw-bold fs-5"
                    style={{
                      background: "transparent",
                      color: "#d1d5db",
                      borderColor: "rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: "#34d399" }}>
                      R${total.toFixed(2)}
                    </span>
                  </li>
                </ul>
                <Link to="/checkout">
                  <button
                    className="btn w-100 py-3 mb-3"
                    style={{
                      background: "linear-gradient(to right, #10b981, #3b82f6)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Comprar
                  </button>
                </Link>
                <div className="text-center mb-3" style={{ color: "#d1d5db" }}>
                  <FaShieldAlt className="me-2" />
                  Checkout Seguro
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <FaCcVisa size={24} color="#a78bfa" />
                  <FaCcMastercard size={24} color="#a78bfa" />
                  <FaCcAmex size={24} color="#a78bfa" />
                  <FaCcPaypal size={24} color="#a78bfa" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        {cartItems.length > 0 && (
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4">
            <Link
              to="/produtos"
              className="btn text-decoration-none d-flex align-items-center"
              style={{
                background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontWeight: "bold",
              }}
            >
              <FaShoppingCart size={24} className="me-2" />
              Continuar Comprando
            </Link>
            <button
              onClick={confirmClearCart}
              className="btn text-decoration-none d-flex align-items-center"
              style={{
                background: "rgba(225, 29, 72, 0.2)",
                border: "1px solid rgba(225, 29, 72, 0.3)",
                color: "#fda4af",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontWeight: "bold",
              }}
            >
              <FaTrash size={24} className="me-2" />
              Limpar Carrinho
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      {showClearConfirm && (
        <div
          className="modal show d-flex align-items-center justify-content-center"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "1rem",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.5)",
              padding: "1.5rem",
              color: "white",
              maxWidth: "500px",
            }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title" style={{ color: "#a78bfa" }}>
                Limpar Carrinho
              </h5>
            </div>
            <div className="modal-body py-4">
              <p>Tem certeza que deseja limpar seu carrinho?</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn"
                onClick={() => setShowClearConfirm(false)}
                style={{
                  background: "rgba(31, 41, 55, 0.5)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  color: "white",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                onClick={clearCart}
                style={{
                  background: "rgba(225, 29, 72, 0.5)",
                  border: "1px solid rgba(225, 29, 72, 0.3)",
                  color: "#fda4af",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontWeight: "bold",
                }}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveConfirm && (
        <div
          className="modal show d-flex align-items-center justify-content-center"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "1rem",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.5)",
              padding: "1.5rem",
              color: "white",
              maxWidth: "500px",
            }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title" style={{ color: "#a78bfa" }}>
                Remover Item
              </h5>
            </div>
            <div className="modal-body py-4">
              <p>Tem certeza que deseja remover este item do seu carrinho?</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn"
                onClick={() => setShowRemoveConfirm(false)}
                style={{
                  background: "rgba(31, 41, 55, 0.5)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  color: "white",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                onClick={removeItem}
                style={{
                  background: "rgba(225, 29, 72, 0.5)",
                  border: "1px solid rgba(225, 29, 72, 0.3)",
                  color: "#fda4af",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontWeight: "bold",
                }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
