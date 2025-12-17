import { createContext, useContext } from "react";

type CartItemVariant = {
  variantId: string;
  optionId: string;
};

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  variants: CartItemVariant[];
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export const CartContext = createContext<{
  cart: Cart;
  setCart: (cart: Cart) => void;
}>({
  cart: {} as Cart,
  setCart: () => {},
});

export const useCart = () => useContext(CartContext);
