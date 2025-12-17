import { createCookie } from "react-router";

import prisma from "./prisma.server";

export const cartCookie = createCookie("cart", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30,
  secrets: [process.env.COOKIE_SECRET!],
});

export async function createCart() {
  const cart = await prisma.cart.create({
    data: {},
    include: {
      items: {
        include: {
          variants: true,
        },
      },
    },
  });

  return cart;
}

export async function getCart(cartId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          productId: true,
          variants: {
            select: {
              variantId: true,
              optionId: true,
            },
          },
        },
      },
    },
  });

  return cart;
}

type AddCartItem = {
  productId: string;
  quantity: number;
  variants: {
    [variantId: string]: string;
  };
};

export async function addCartItem(cartId: string, item: AddCartItem) {
  const cartItem = await prisma.cartItem.create({
    select: {
      id: true,
      quantity: true,
      productId: true,
      variants: {
        select: {
          variantId: true,
          optionId: true,
        },
      },
    },
    data: {
      cartId,
      productId: item.productId,
      quantity: item.quantity,
      variants: {
        createMany: {
          data: Object.keys(item.variants).map((variantId) => ({
            variantId,
            optionId: item.variants[variantId],
          })),
        },
      },
    },
  });

  return cartItem;
}
