import { useState, useEffect } from "react";
import { useMemo } from "react";
import { db } from "../data/db";
import type { Guitar, CartItem } from '../types'

export const useCart = () => {

  const initialCart = (): Array<CartItem> => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 10;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: Guitar) {
    const itemExits = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExits >= 0) {
      if (cart[itemExits].quantity >= MAX_ITEMS) return;
      const updateCart = [...cart];
      updateCart[itemExits].quantity++;
      setCart(updateCart);
    } else {
      const newItem: CartItem = {...item, quantity: 1}
      setCart((prevCart) => [...prevCart, newItem]);
    }
  }

  function removeFromCart(id: Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar['id']) {
    const updateCart = cart.map((guitar) =>
      guitar.id === id && guitar.quantity < MAX_ITEMS
        ? { ...guitar, quantity: guitar.quantity + 1 }
        : guitar
    );
    setCart(updateCart);
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updateCart = cart.map((guitar) =>
      guitar.id === id && guitar.quantity > MIN_ITEMS
        ? { ...guitar, quantity: guitar.quantity - 1 }
        : guitar
    );
    setCart(updateCart);
  }

  function cleanCart() {
    setCart([]);
  }

    //state derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(
      () => cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0),
      [cart]
    );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cleanCart,
    isEmpty,
    cartTotal
  };
};
