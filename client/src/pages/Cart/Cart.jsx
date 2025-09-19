import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import {
  FaShoppingCart,
  FaTrash,
  FaShieldAlt,
  FaMinus,
  FaPlus,
  FaChevronLeft,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "./Cart.css"; // Importe o novo arquivo CSS

const Cart = () => {
  const {
    cartItems,
    removeItem: contextRemoveItem,
    updateQuantity: contextUpdateQuantity,
    clearCart: contextClearCart,
  } = useCart();

  // ... (toda a lógica e os estados permanecem os mesmos) ...
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
    <div className="cart-page">
      <ToastContainer />
      <div className="cart-container">
        {/* Empty Cart Message */}
        {cartItems.length === 0 && (
          <div className="cart-empty">
            <FaShoppingCart className="cart-empty__icon" />
            <p className="cart-empty__text">Seu carrinho está vazio</p>
            <Link to="/produtos" className="btn-retro btn-retro--primary">
              Continuar Comprando
            </Link>
          </div>
        )}

        {/* Mobile View */}
        <div className="cart-mobile-view">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-card cart-item--mobile">
              <div className="cart-item__header">
                <div className="cart-item__details">
                  <img
                    // ✅ CORREÇÃO 1 AQUI
                    src={item.imageUrl || "https://via.placeholder.com/80"}
                    alt="Product"
                    className="cart-item__image"
                  />
                  <div>
                    <h5 className="cart-item__name">{item.name}</h5>
                  </div>
                </div>
                <button
                  onClick={() => confirmRemoveItem(item.id)}
                  className="cart-item__remove-btn"
                >
                  <FaTrash size={24} />
                </button>
              </div>

              <div className="cart-item__grid">
                <div className="cart-item__grid-col">
                  <span className="cart-item__label">Quantidade:</span>
                  <div className="quantity-control quantity-control--mobile">
                    <button
                      className="quantity-control__btn"
                      onClick={() => decrementQuantity(item.id, item.quantity)}
                    >
                      <FaChevronLeft />
                    </button>
                    <input
                      type="number"
                      className="quantity-control__input"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      min="1"
                    />
                    <button
                      className="quantity-control__btn"
                      onClick={() => incrementQuantity(item.id, item.quantity)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="cart-item__grid-col">
                  <span className="cart-item__label">Preço:</span>
                  <div className="cart-item__price">
                    R${Number(item.price).toFixed(2)}
                  </div>
                </div>

                <div className="cart-item__grid-col">
                  <span className="cart-item__label">Total:</span>
                  <div className="cart-item__total">
                    R${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet/Desktop View */}
        {cartItems.length > 0 && (
          <div className="cart-desktop-view">
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr className="cart-table__header-row">
                    <th className="cart-table__header">Produto</th>
                    <th className="cart-table__header cart-table__header--center">
                      Quantidade
                    </th>
                    <th className="cart-table__header cart-table__header--right">
                      Preço
                    </th>
                    <th className="cart-table__header cart-table__header--right">
                      Total
                    </th>
                    <th className="cart-table__header cart-table__header--center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="cart-table__body-row">
                      <td className="cart-table__cell">
                        <div className="cart-item__details">
                          <img
                            // ✅ CORREÇÃO 2 AQUI
                            src={
                              item.imageUrl || "https://via.placeholder.com/80"
                            }
                            alt="Product"
                            className="cart-item__image"
                          />
                          <div>
                            <h6>
                              <Link
                                to={`/produto/${item.id}`}
                                className="cart-item__link"
                              >
                                {item.name}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="cart-table__cell cart-table__cell--center">
                        <div className="quantity-control">
                          <button
                            className="quantity-control__btn"
                            onClick={() =>
                              decrementQuantity(item.id, item.quantity)
                            }
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            className="quantity-control__input"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            min="1"
                          />
                          <button
                            className="quantity-control__btn"
                            onClick={() =>
                              incrementQuantity(item.id, item.quantity)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="cart-table__cell cart-table__cell--right">
                        <span className="cart-item__price">
                          R${Number(item.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="cart-table__cell cart-table__cell--right">
                        <span className="cart-item__total">
                          R${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td className="cart-table__cell cart-table__cell--center">
                        <button
                          onClick={() => confirmRemoveItem(item.id)}
                          className="cart-item__remove-btn"
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
          <div className="cart-summary-section">
            <div className="cart-summary__main">
              {/* Shipping Options */}
              <div className="cart-card">
                <h5 className="cart-card__title">Opções de Envio</h5>
                <div className="shipping-options">
                  {/* Standard Shipping */}
                  <div
                    className={`shipping-option ${
                      shippingMethod === "standard"
                        ? "shipping-option--selected"
                        : ""
                    }`}
                    onClick={() => setShippingMethod("standard")}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      id="standardShipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                    />
                    <label htmlFor="standardShipping">
                      <div>
                        <div className="shipping-option__name">
                          Chave do Produto
                        </div>
                        <div className="shipping-option__desc">
                          Resgate uma chave exclusiva imediatamente
                        </div>
                      </div>
                      <div className="shipping-option__price">R$5.00</div>
                    </label>
                  </div>

                  {/* Express Shipping */}
                  <div
                    className={`shipping-option ${
                      shippingMethod === "express"
                        ? "shipping-option--selected"
                        : ""
                    }`}
                    onClick={() => setShippingMethod("express")}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      id="expressShipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                    />
                    <label htmlFor="expressShipping">
                      <div>
                        <div className="shipping-option__name">Express</div>
                        <div className="shipping-option__desc">
                          Entrega em 2-3 dias - Mídia física
                        </div>
                      </div>
                      <div className="shipping-option__price">R$15.00</div>
                    </label>
                  </div>

                  {/* Overnight Shipping */}
                  <div
                    className={`shipping-option ${
                      shippingMethod === "overnight"
                        ? "shipping-option--selected"
                        : ""
                    }`}
                    onClick={() => setShippingMethod("overnight")}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      id="overnightShipping"
                      value="overnight"
                      checked={shippingMethod === "overnight"}
                      onChange={() => setShippingMethod("overnight")}
                    />
                    <label htmlFor="overnightShipping">
                      <div>
                        <div className="shipping-option__name">Standard</div>
                        <div className="shipping-option__desc">
                          Entrega em 5-7 dias - Mídia física
                        </div>
                      </div>
                      <div className="shipping-option__price">R$25.00</div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="cart-card">
                <h5 className="cart-card__title">Código Promocional</h5>
                <div className="promo-code__group">
                  <input
                    type="text"
                    className="promo-code__input"
                    placeholder="Digite SAVE10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    className="promo-code__button"
                    type="button"
                    onClick={applyPromoCode}
                  >
                    Aplicar
                  </button>
                </div>
                {promoMessage && (
                  <div
                    className={`promo-code__message ${
                      promoValid
                        ? "promo-code__message--success"
                        : "promo-code__message--error"
                    }`}
                  >
                    {promoMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="cart-summary__sidebar">
              <div className="cart-card order-summary">
                <h5 className="cart-card__title">Resumo do Pedido</h5>
                <ul className="order-summary__list">
                  <li className="order-summary__item">
                    <span>Subtotal</span>
                    <span>R${subtotal.toFixed(2)}</span>
                  </li>
                  <li className="order-summary__item">
                    <span>Frete</span>
                    <span>R${shippingCost.toFixed(2)}</span>
                  </li>
                  {discount > 0 && (
                    <li className="order-summary__item order-summary__item--discount">
                      <span>Desconto</span>
                      <span>-R${discount.toFixed(2)}</span>
                    </li>
                  )}
                  <li className="order-summary__item">
                    <span>Taxa</span>
                    <span>R${tax.toFixed(2)}</span>
                  </li>
                  <li className="order-summary__item order-summary__item--total">
                    <span>Total</span>
                    <span className="order-summary__total-price">
                      R${total.toFixed(2)}
                    </span>
                  </li>
                </ul>
                <Link to="/checkout">
                  <button className="btn-retro btn-retro--checkout">
                    Comprar
                  </button>
                </Link>
                <div className="order-summary__secure">
                  <FaShieldAlt />
                  Checkout Seguro
                </div>
                <div className="order-summary__payment-icons">
                  <FaCcVisa size={24} />
                  <FaCcMastercard size={24} />
                  <FaCcAmex size={24} />
                  <FaCcPaypal size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        {cartItems.length > 0 && (
          <div className="cart-actions">
            <Link to="/produtos" className="btn-retro btn-retro--primary">
              <FaShoppingCart size={24} />
              Continuar Comprando
            </Link>
            <button
              onClick={confirmClearCart}
              className="btn-retro btn-retro--danger"
            >
              <FaTrash size={24} />
              Limpar Carrinho
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      {showClearConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Limpar Carrinho</h5>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja limpar seu carrinho?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-button modal-button--cancel"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-button modal-button--confirm"
                onClick={clearCart}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Remover Item</h5>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja remover este item do seu carrinho?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-button modal-button--cancel"
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-button modal-button--confirm"
                onClick={removeItem}
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
