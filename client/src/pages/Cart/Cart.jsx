import React, { useEffect, useState } from "react";
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
import styles from "./cart.module.css";

import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeItem: contextRemoveItem,
    updateQuantity: contextUpdateQuantity,
    clearCart: contextClearCart,
    validateCoupon: contextValidateCoupon,
    shippingMethods,
    getShippingMethods,
    shippingCost,
    selectShippingMethodById,
    shippingMethod,
    tax,
    discount,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingMethodSelected, setShippingMethodSelected] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    if (user?.role === "seller" || user?.role === "admin") navigate("/profile");
  }, [user, navigate]);

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

  useEffect(() => {
    async function refreshMethodsShipping() {
      await getShippingMethods();
    }
    refreshMethodsShipping();
  }, [getShippingMethods]);

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
    setDiscountValue(0);
  };

  const incrementQuantity = (id, qty) => {
    contextUpdateQuantity(id, qty + 1);
  };
  const decrementQuantity = (id, qty) => {
    if (qty > 1) contextUpdateQuantity(id, qty - 1);
  };

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value) || 1;
    contextUpdateQuantity(id, Math.max(1, newQuantity));
  };

  const applyPromoCode = async () => {
    if (promoCode.trim() === "") {
      setPromoMessage("Please enter a promo code");
      setPromoValid(false);
      return;
    }

    const promo = await contextValidateCoupon(promoCode.toUpperCase());
    if (promo?.valid) {
      setPromoValid(true);
      setPromoMessage(`Desconto aplicado com sucesso`);
      notifySuccess(promo.message);
      setDiscountValue(subtotal * discount);
    } else {
      setPromoValid(false);
      setPromoMessage(`${promo?.message}`);
      setDiscountValue(0);
    }
  };

  // Order summary calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (subtotal * discount !== discountValue)
    setDiscountValue(subtotal * discount);
  const total = subtotal + shippingCost + tax - discountValue;

  return (
    <div className={styles["cart-page"]}>
      <ToastContainer />
      <div className={styles["cart-container"]}>
        {/* Empty Cart Message */}
        {cartItems.length === 0 && (
          <div className={styles["cart-empty"]}>
            <FaShoppingCart className={styles["cart-empty__icon"]} />
            <p className={styles["cart-empty__text"]}>
              Seu carrinho está vazio
            </p>
            <Link
              to="/produtos"
              className={`${styles["btn-retro"]} ${styles["btn-retro--primary"]}`}
            >
              Continuar Comprando
            </Link>
          </div>
        )}

        {/* Mobile View */}
        <div className={styles["cart-mobile-view"]}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`${styles["cart-card"]} ${styles["cart-item--mobile"]}`}
            >
              <div className={styles["cart-item__header"]}>
                <div className={styles["cart-item__details"]}>
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/80"}
                    alt="Product"
                    className={styles["cart-item__image"]}
                  />
                  <div>
                    <h5 className={styles["cart-item__name"]}>{item.name}</h5>
                  </div>
                </div>
                <button
                  onClick={() => confirmRemoveItem(item.id)}
                  className={styles["cart-item__remove-btn"]}
                >
                  <FaTrash size={24} />
                </button>
              </div>

              <div className={styles["cart-item__grid"]}>
                <div className={styles["cart-item__grid-col"]}>
                  <span className={styles["cart-item__label"]}>
                    Quantidade:
                  </span>
                  <div
                    className={`${styles["quantity-control"]} ${styles["quantity-control--mobile"]}`}
                  >
                    <button
                      className={styles["quantity-control__btn"]}
                      onClick={() => decrementQuantity(item.id, item.quantity)}
                    >
                      <FaChevronLeft />
                    </button>
                    <input
                      type="number"
                      className={styles["quantity-control__input"]}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      min="1"
                    />
                    <button
                      className={styles["quantity-control__btn"]}
                      onClick={() => incrementQuantity(item.id, item.quantity)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className={styles["cart-item__grid-col"]}>
                  <span className={styles["cart-item__label"]}>Preço:</span>
                  <div className={styles["cart-item__price"]}>
                    R${Number(item.price).toFixed(2)}
                  </div>
                </div>

                <div className={styles["cart-item__grid-col"]}>
                  <span className={styles["cart-item__label"]}>Total:</span>
                  <div className={styles["cart-item__total"]}>
                    R${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet/Desktop View */}
        {cartItems.length > 0 && (
          <div className={styles["cart-desktop-view"]}>
            <div className={styles["cart-table-wrapper"]}>
              <table className={styles["cart-table"]}>
                <thead>
                  <tr className={styles["cart-table__header-row"]}>
                    <th className={styles["cart-table__header"]}>Produto</th>
                    <th
                      className={`${styles["cart-table__header"]} ${styles["cart-table__header--center"]}`}
                    >
                      Quantidade
                    </th>
                    <th
                      className={`${styles["cart-table__header"]} ${styles["cart-table__header--right"]}`}
                    >
                      Preço
                    </th>
                    <th
                      className={`${styles["cart-table__header"]} ${styles["cart-table__header--right"]}`}
                    >
                      Total
                    </th>
                    <th
                      className={`${styles["cart-table__header"]} ${styles["cart-table__header--center"]}`}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      className={styles["cart-table__body-row"]}
                    >
                      <td className={styles["cart-table__cell"]}>
                        <div className={styles["cart-item__details"]}>
                          <img
                            src={
                              item.imageUrl || "https://via.placeholder.com/80"
                            }
                            alt="Product"
                            className={styles["cart-item__image"]}
                          />
                          <div>
                            <h6>
                              <Link
                                to={`/produto/${item.id}`}
                                className={styles["cart-item__link"]}
                              >
                                {item.name}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`${styles["cart-table__cell"]} ${styles["cart-table__cell--center"]}`}
                      >
                        <div className={styles["quantity-control"]}>
                          <button
                            className={styles["quantity-control__btn"]}
                            onClick={() =>
                              decrementQuantity(item.id, item.quantity)
                            }
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            className={styles["quantity-control__input"]}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            min="1"
                          />
                          <button
                            className={styles["quantity-control__btn"]}
                            onClick={() =>
                              incrementQuantity(item.id, item.quantity)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td
                        className={`${styles["cart-table__cell"]} ${styles["cart-table__cell--right"]}`}
                      >
                        <span className={styles["cart-item__price"]}>
                          R${Number(item.price).toFixed(2)}
                        </span>
                      </td>
                      <td
                        className={`${styles["cart-table__cell"]} ${styles["cart-table__cell--right"]}`}
                      >
                        <span className={styles["cart-item__total"]}>
                          R${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td
                        className={`${styles["cart-table__cell"]} ${styles["cart-table__cell--center"]}`}
                      >
                        <button
                          onClick={() => confirmRemoveItem(item.id)}
                          className={styles["cart-item__remove-btn"]}
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
          <div className={styles["cart-summary-section"]}>
            <div className={styles["cart-summary__main"]}>
              {/* Shipping Options */}
              <div className={styles["cart-card"]}>
                <h5 className={styles["cart-card__title"]}>Opções de Envio</h5>

                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`${styles["shipping-option"]} ${
                      shippingMethod?.id === method.id
                        ? styles["shipping-option--selected"]
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
                      onChange={() => selectShippingMethodById(method.id)}
                    />
                    <label htmlFor={`shippingMethod${method.id}`}>
                      <div>
                        <div className={styles["shipping-option__name"]}>
                          {method.name}
                        </div>
                        <div className={styles["shipping-option__desc"]}>
                          {method.description}
                        </div>
                      </div>
                      <div className={styles["shipping-option__price"]}>
                        R${method.price.toFixed(2)}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className={styles["cart-card"]}>
                <h5 className={styles["cart-card__title"]}>
                  Código Promocional
                </h5>
                <div className={styles["promo-code__group"]}>
                  <input
                    type="text"
                    className={styles["promo-code__input"]}
                    placeholder="Digite SAVE10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    className={styles["promo-code__button"]}
                    type="button"
                    onClick={applyPromoCode}
                  >
                    Aplicar
                  </button>
                </div>
                {promoMessage && (
                  <div
                    className={`${styles["promo-code__message"]} ${
                      promoValid
                        ? styles["promo-code__message--success"]
                        : styles["promo-code__message--error"]
                    }`}
                  >
                    {promoMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className={styles["cart-summary__sidebar"]}>
              <div
                className={`${styles["cart-card"]} ${styles["order-summary"]}`}
              >
                <h5 className={styles["cart-card__title"]}>Resumo do Pedido</h5>
                <ul className={styles["order-summary__list"]}>
                  <li className={styles["order-summary__item"]}>
                    <span>Subtotal</span>
                    <span>R${subtotal.toFixed(2)}</span>
                  </li>
                  <li className={styles["order-summary__item"]}>
                    <span>Frete</span>
                    <span>R${shippingCost.toFixed(2)}</span>
                  </li>
                  {discountValue > 0 && (
                    <li
                      className={`${styles["order-summary__item"]} ${styles["order-summary__item--discount"]}`}
                    >
                      <span>Desconto</span>
                      <span>-R${discountValue.toFixed(2)}</span>
                    </li>
                  )}
                  <li className={styles["order-summary__item"]}>
                    <span>Taxa</span>
                    <span>R${tax.toFixed(2)}</span>
                  </li>
                  <li
                    className={`${styles["order-summary__item"]} ${styles["order-summary__item--total"]}`}
                  >
                    <span>Total</span>
                    <span className={styles["order-summary__total-price"]}>
                      R${total.toFixed(2)}
                    </span>
                  </li>
                </ul>
                <Link to="/checkout">
                  <button
                    className={`${styles["btn-retro"]} ${styles["btn-retro--checkout"]}`}
                  >
                    Comprar
                  </button>
                </Link>
                <div className={styles["order-summary__secure"]}>
                  <FaShieldAlt />
                  Checkout Seguro
                </div>
                <div className={styles["order-summary__payment-icons"]}>
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
          <div className={styles["cart-actions"]}>
            <Link
              to="/produtos"
              className={`${styles["btn-retro"]} ${styles["btn-retro--primary"]}`}
            >
              <FaShoppingCart size={24} />
              Continuar Comprando
            </Link>
            <button
              onClick={confirmClearCart}
              className={`${styles["btn-retro"]} ${styles["btn-retro--danger"]}`}
            >
              <FaTrash size={24} />
              Limpar Carrinho
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      {showClearConfirm && (
        <div className={styles["modal-backdrop"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h5 className={styles["modal-title"]}>Limpar Carrinho</h5>
            </div>
            <div className={styles["modal-body"]}>
              <p>Tem certeza que deseja limpar seu carrinho?</p>
            </div>
            <div className={styles["modal-footer"]}>
              <button
                type="button"
                className={`${styles["modal-button"]} ${styles["modal-button--cancel"]}`}
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`${styles["modal-button"]} ${styles["modal-button--confirm"]}`}
                onClick={clearCart}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveConfirm && (
        <div className={styles["modal-backdrop"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h5 className={styles["modal-title"]}>Remover Item</h5>
            </div>
            <div className={styles["modal-body"]}>
              <p>Tem certeza que deseja remover este item do seu carrinho?</p>
            </div>
            <div className={styles["modal-footer"]}>
              <button
                type="button"
                className={`${styles["modal-button"]} ${styles["modal-button--cancel"]}`}
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`${styles["modal-button"]} ${styles["modal-button--confirm"]}`}
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
