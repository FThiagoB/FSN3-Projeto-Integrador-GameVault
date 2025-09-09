import { useState } from "react";
import { Button } from "react-bootstrap";
import { IoCloseCircleOutline, IoCart } from "react-icons/io5";
import { useCart } from "../../contexts/CartContext";
import { Link, useLocation } from "react-router-dom";

const CartFloat = () => {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, itemCount, removeItem, updateQuantity, clearCart } =
    useCart();

  const handleCloseCart = () => setShowCart(!showCart);
  const handleOpenCart = () => setShowCart(!showCart);

  // Calcular valores do carrinho
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const shipping = 19.9;
  const discount = 10.0;
  const total = subtotal + shipping - discount;

  const location = useLocation();
  if (location.pathname === "/cart" || location.pathname === "/checkout") {
    return null;
  }

  return (
    <div className="d-none d-md-block">
      <div
        style={{
          position: "fixed",
          zIndex: 1000,
          right: "1.5rem",
          top: "16vh",
          transition: "all 0.3s ease",
        }}
      >
        {/* Badge flutuante com contagem */}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            transform: showCart ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.2s",
            zIndex: 10,
          }}
          onClick={handleOpenCart}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "linear-gradient(45deg, #ec4899, #a78bfa)",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.9rem",
              fontWeight: "bold",
              boxShadow: "0 2px 10px rgba(139, 92, 246, 0.4)",
              zIndex: 2,
              animation: "pulse 2s infinite",
            }}
          >
            {itemCount}
          </div>
          <div
            style={{
              background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
              borderRadius: "50%",
              padding: "0.8rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 1,
              transition: "all 0.3s ease",
            }}
          >
            <IoCart size={34} color="white" />
          </div>
        </div>

        {/* Painel do carrinho */}
        {showCart && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 1rem)",
              right: 0,
              maxWidth: "24rem",
              width: "90vw",
              maxHeight: "60vh",
              overflowY: "auto",
              borderRadius: "1rem",
              //   animation: "fadeIn 0.3s ease, float 3s ease-in-out infinite",
              scrollbarWidth: "thin",
              background:
                "linear-gradient(to bottom right, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
              padding: "2rem",
              color: "white",
              zIndex: 5,
            }}
            aria-modal="true"
            role="dialog"
            tabIndex="-1"
          >
            <style>
              {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
              }
              ::-webkit-scrollbar {
                width: 8px;
              }
              ::-webkit-scrollbar-track {
                background: transparent;
              }
              ::-webkit-scrollbar-thumb {
                background: rgba(139, 92, 246, 0.5);
                border-radius: 4px;
              }
            `}
            </style>

            {/* Botão de fechar */}
            <Button
              variant="link"
              className="position-absolute top-0 end-0 p-3"
              onClick={handleCloseCart}
              aria-label="Fechar carrinho"
              style={{ color: "#ec4899", zIndex: 10 }}
            >
              <IoCloseCircleOutline size={36} />
            </Button>

            <div className="mt-4">
              <h4
                className="mb-4 text-center title-retro"
                style={{
                  fontFamily: '"Press Start 2P", system-ui',
                  fontSize: "1.5rem",
                  textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                }}
              >
                <span className="gradient">Seu Carrinho</span>
              </h4>

              {/* Lista de produtos */}
              {cartItems.length === 0 ? (
                <p className="text-center py-4">Seu carrinho está vazio</p>
              ) : (
                <>
                  <ul className="list-unstyled mb-4">
                    {cartItems.map((item) => (
                      <li
                        key={item.id}
                        className="d-flex align-items-center gap-3 mb-4 pb-3"
                        style={{
                          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
                        }}
                      >
                        <div className="position-relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded-sm"
                            style={{
                              width: "64px",
                              height: "64px",
                              objectFit: "cover",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(139, 92, 246, 0.3)",
                            }}
                          />
                          <span
                            className="position-absolute top-0 start-100 translate-middle badge"
                            style={{
                              backgroundColor: "#8b5cf6",
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                            }}
                          >
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-grow-1">
                          <h5
                            className="text-white mb-1"
                            style={{ fontWeight: "bold" }}
                          >
                            {item.name}
                          </h5>

                          <div className="d-flex flex-wrap gap-2">
                            <div className="small" style={{ color: "#d1d5db" }}>
                              <span className="fw-medium">Preço:</span> R${" "}
                              {item.price}
                            </div>
                          </div>

                          <div className="mt-2 d-flex align-items-center gap-2">
                            <span
                              className="fw-medium"
                              style={{ color: "#a78bfa" }}
                            >
                              R${" "}
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2
                              )}
                            </span>
                          </div>

                          <div className="d-flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              style={{
                                background: "rgba(31, 41, 55, 0.5)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                color: "white",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              -
                            </Button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="form-control text-center"
                              style={{
                                width: "50px",
                                background: "rgba(31, 41, 55, 0.5)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                color: "white",
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              style={{
                                background: "rgba(31, 41, 55, 0.5)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                color: "white",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              +
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              style={{
                                background: "rgba(225, 29, 72, 0.2)",
                                border: "1px solid rgba(225, 29, 72, 0.3)",
                                color: "#fda4af",
                              }}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Resumo do pedido */}
                  <div
                    className="pt-3 mb-4"
                    style={{ borderTop: "1px solid rgba(139, 92, 246, 0.2)" }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: "#d1d5db" }}>Subtotal</span>
                      <span className="fw-medium" style={{ color: "#a78bfa" }}>
                        R$ {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: "#d1d5db" }}>Frete</span>
                      <span className="fw-medium" style={{ color: "#a78bfa" }}>
                        R$ {shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: "#d1d5db" }}>Desconto</span>
                      <span className="fw-medium" style={{ color: "#34d399" }}>
                        - R$ {discount.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mt-3 fw-bold fs-5">
                      <span style={{ color: "#d1d5db" }}>Total</span>
                      <span style={{ color: "#34d399" }}>
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Botões de ação */}
              <div className="d-grid gap-3">
                <Link
                  to="/cart"
                  className="rounded-1 fw-bold text-decoration-none"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem",
                    background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    marginBottom: "0.5rem",
                  }}
                >
                  Ver meu carrinho ({itemCount})
                </Link>

                <Link
                  to="/checkout"
                  className="rounded-1 fw-bold text-decoration-none"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem",
                    background: "linear-gradient(to right, #10b981, #3b82f6)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    marginBottom: "0.5rem",
                  }}
                >
                  Finalizar Compra
                </Link>

                {cartItems.length > 0 && (
                  <Button
                    variant="link"
                    className="text-decoration-none p-0"
                    onClick={clearCart}
                    style={{ color: "#fda4af", textAlign: "center" }}
                  >
                    Limpar carrinho
                  </Button>
                )}

                <div className="text-center mt-2">
                  <Button
                    variant="link"
                    className="text-decoration-none p-0"
                    onClick={handleCloseCart}
                    style={{ color: "#a78bfa" }}
                  >
                    Continuar comprando
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartFloat;
