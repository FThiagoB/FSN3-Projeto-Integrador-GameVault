import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0)
  const [tax, setTax] = useState(0)

  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState({});
  const [shippingMethods, setShippingMethods] = useState([]);

  const logoutClearInfo = () => {
    setCartItems([])
    setDiscount(0);
    setShippingCost(0);
    setTax(0);

    setCouponCode("");
    setShippingMethod({})
    setShippingMethods([])
  }

  // Função para calcular imposto com base na quantidade total de itens
  const calculateTax = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const taxRatePerItem = 1; // R$2 por item, por exemplo
    const totalTax = totalItems * taxRatePerItem;

    setTax(totalTax);
  };

  const addToCart = (product, quantity = 1, stock) => {
    setCartItems((prevItems) => {
      // Verifica se o produto já existe no carrinho
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Atualiza a quantidade se já existir
        return prevItems.map((item, index) =>{
          return index === existingItemIndex
            ? { ...item, quantity: ((item.quantity + quantity) <= item.stock) ? item.quantity + quantity : item.quantity }
            : item
        });
      } else {
        // Adiciona novo item
        return [...prevItems, { ...product, quantity, stock }];
        
      }
      
    });

    calculateTax();
  };

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: ( Math.max(1, newQuantity) <= item.stock) ? + Math.max(1, newQuantity) : item.quantity } : item
      )
    );

    calculateTax();
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    calculateTax();
  };

  const clearCart = () => {
    setCartItems([]);
    setTax(0);
  };

  // Valida os itens do carrinho no backend
  const validateCart = async () => {
    try {
      const payload = {
        items: cartItems.map((item) => ({
          gameID: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("http://localhost:4500/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          valid: false,
          errors: data.errors || [{ message: data.message || "Validation failed" }],
        };
      }

      // Exemplo de retorno esperado: { valid, items, errors, subtotal }
      return data;
    } catch (error) {
      console.error("Error validating cart:", error);
      return { valid: false, errors: [{ message: "Server error" }] };
    }
  };

  // Valida cupom no backend
  const validateCoupon = async (code) => {
    try {
      const response = await fetch("http://localhost:4500/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { valid: false, message: data.message || "Invalid coupon" };
      }

      setCouponCode( code );
      setDiscount(data.discount);

      return {
        valid: true,
        discountPercent: data.discount, // percentual de desconto
        expiresAt: data.expiresAt,
      };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return { valid: false, message: "Error validating coupon" };
    }
  };

  // Valida cupom no backend
  const getShippingMethods = async () => {
    try {
      const response = await fetch("http://localhost:4500/shipping/methods", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("ERRO")
        setShippingMethods([]);
        return { error: true };
      }

      setShippingMethods(data);
      setShippingMethod(data[0]);
      setShippingCost(data[0].price || 0);

      return data
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  };

  // Seleciona um método de envio pelo ID
  const selectShippingMethodById = (id) => {
    const method = shippingMethods.find((m) => m.id === id);
    if (method) {
      setShippingMethod(method);
      setShippingCost(method.price || 0);
    } else {
      console.warn(`Shipping method with id ${id} not found`);
    }
  };


  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    validateCart,
    discount,
    validateCoupon,
    shippingMethods,
    shippingMethod,
    getShippingMethods,
    selectShippingMethodById,
    shippingCost,
    tax,
    couponCode,
    logoutClearInfo
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
