import {
  CreditCardIcon,
  PackageOpenIcon,
  ShieldCheckIcon,
  TrashIcon,
  TruckIcon,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";

import Button, { IconButton } from "~/components/Button";
import Container from "~/components/Container";
import Input from "~/components/Input";

import { cartCookie, createCart, getCart } from "~/lib/cart.server";
import prisma from "~/lib/prisma.server";

import type { Route } from "./+types/cart";
import format from "~/lib/format";

export async function loader({ request }: Route.LoaderArgs) {
  const cartId = await cartCookie.parse(request.headers.get("Cookie"));

  let cart = cartId ? await getCart(cartId) : null;

  if (!cart) {
    cart = await createCart();
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      images: {
        select: {
          id: true,
          url: true,
        },
        orderBy: {
          url: "asc",
        },
      },
      variants: {
        select: {
          id: true,
          name: true,
          options: {
            select: {
              id: true,
              name: true,
              imageId: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    where: {
      id: {
        in: cart.items.map((item) => item.productId),
      },
    },
  });

  const result = [];

  for (const item of cart.items) {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      continue;
    }

    let image = product.images[0];

    const variants = [];

    for (const variant of product.variants) {
      const selectedVariant = item.variants.find(
        (v) => v.variantId === variant.id
      );

      if (!selectedVariant) {
        continue;
      }

      const selectedOption = variant.options.find(
        (option) => option.id === selectedVariant.optionId
      );

      if (!selectedOption) {
        continue;
      }

      if (selectedOption.imageId) {
        image =
          product.images.find((image) => image.id === selectedOption.imageId) ||
          image;
      }

      variants.push({
        ...selectedVariant,
        name: variant.name,
        value: selectedOption.name,
      });
    }

    result.push({
      ...item,
      name: product.name,
      price: product.price,
      image,
      variants,
    });
  }

  return {
    cart: {
      id: cart.id,
      items: result,
    },
  };
}

export async function action({ request }: Route.ActionArgs) {
  const cartId = await cartCookie.parse(request.headers.get("Cookie"));

  if (!cartId) {
    return;
  }

  const cart = await getCart(cartId);

  if (!cart) {
    return;
  }

  const formData = await request.formData();

  if (formData.has("remove")) {
    const cartItemId = formData.get("remove");

    if (!cartItemId) {
      return;
    }

    cart.items = cart.items.filter((item) => item.id !== cartItemId);
  }
}

function CartReservedBanner() {
  const [time, setTime] = useState(60 * 5);

  function getTimeString() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          return 60 * 5;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center mt-4 px-4 py-3 bg-zinc-900 rounded text-white text-sm text-center font-semibold">
      <p>Cart reserved for {getTimeString()}</p>
    </div>
  );
}

export default function Cart({ loaderData }: Route.ComponentProps) {
  const { cart } = loaderData;

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.items.reduce(
    (acc, item) => acc + (item.price / 80) * 100 * item.quantity,
    0
  );

  const cartDiscount = cart.items.reduce(
    (acc, item) => (item.price / 80) * 100 * 0.2 * item.quantity + acc,
    0
  );

  const cartTotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="px-4 pt-8">
      <Container>
        <div className="flex items-center justify-center text-center md:justify-start md:text-left">
          <h1 className="text-2xl font-bold">Cart ({cartCount})</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-4 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="flex flex-col gap-2 items-center justify-center text-center md:items-start md:text-left">
              <div className="relative w-full h-4 bg-zinc-100 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full w-1/2 bg-orange-500 rounded-full"
                  style={{
                    width: `${Math.min((cartSubtotal / 50) * 100, 100)}%`,
                  }}
                ></div>
              </div>

              <p className="font-semibold text-sm">
                {cartTotal < 50
                  ? `🚚 You're only ${format.currency(
                      50 - cartTotal
                    )} away from Free Shipping!`
                  : `⚡ You're eligible for Free Shipping!`}
              </p>
            </div>

            {cart.items.length > 0 ? (
              <>
                <CartReservedBanner />

                <div className="flex flex-col mt-4 border border-zinc-200 rounded-lg">
                  {cart.items.map((cartItem) => (
                    <div className="flex gap-4 p-4 border-t border-zinc-200 first:border-t-0">
                      <div className="min-w-20 w-20 h-20 p-2 bg-zinc-100 rounded">
                        <img
                          alt={cartItem.name}
                          className="w-full h-full object-contain"
                          src={cartItem.image.url}
                        />
                      </div>

                      <div className="flex flex-col w-full">
                        <div className="flex items-start justify-between gap-4 w-full">
                          <p className="text-lg font-semibold leading-4.5">
                            {cartItem.name}
                          </p>

                          <button>
                            <TrashIcon className="w-4 h-4 text-zinc-500" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-zinc-500 text-sm leading-4">
                          {cartItem.variants.map((variant, index) => (
                            <Fragment key={variant.variantId}>
                              <strong>{variant.name}:</strong> {variant.value}
                              {index !== cartItem.variants.length - 1 && ", "}
                            </Fragment>
                          ))}
                        </p>

                        <div className="flex items-end justify-between gap-4 mt-auto">
                          <div className="flex items-center gap-1.5">
                            <p className="text-red-500 font-semibold leading-4">
                              {format.currency(cartItem.price)}
                            </p>

                            <p className="text-sm text-zinc-500 font-medium line-through">
                              {format.currency((cartItem.price / 80) * 100)}
                            </p>
                          </div>

                          <Input
                            className="h-8 max-w-16 px-2 text-center"
                            type="number"
                            defaultValue={cartItem.quantity}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-4 p-4 border border-zinc-200 rounded-lg font-semibold">
                <p>Your cart is empty 🙁</p>
              </div>
            )}

            <div className="grid grid-cols-4 mt-4">
              <div className="flex flex-col items-center justify-center text-center">
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Secure Checkout
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <CreditCardIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Safe Payment Methods
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <PackageOpenIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Free 14 Days Returns
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <TruckIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Delivery Guarantee
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-zinc-200 rounded-lg">
              <div className="flex p-4">
                <h2 className="text-xl font-semibold leading-5">
                  Order Summary
                </h2>
              </div>

              <div className="flex flex-col p-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <p>Subtotal</p>
                  <p>{format.currency(cartSubtotal)}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p>Discounts</p>
                  {cartDiscount > 0 ? (
                    <p className="text-red-600 font-medium">
                      -{format.currency(cartDiscount)}
                    </p>
                  ) : (
                    <p>$0.00</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p>Shipping</p>
                  <p className="text-zinc-500 italic">Next Step</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200 text-lg font-bold">
                  <p>Total</p>
                  <p>{format.currency(cartTotal)}</p>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <Link to="/checkout">
                <Button className="w-full" disabled={cartCount === 0}>
                  Checkout {cartCount > 0 && `(${cartCount})`}
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-0.5 mt-2">
                <img
                  alt="Diners Club"
                  className="h-6 rounded-xs"
                  src="/img/diners.svg"
                />
                <img
                  alt="Discover"
                  className="h-6 rounded-xs"
                  src="/img/discover.svg"
                />
                <img
                  alt="Mastercard"
                  className="h-6 rounded-xs"
                  src="/img/mastercard.svg"
                />
                <img
                  alt="Visa"
                  className="h-6 rounded-xs"
                  src="/img/visa.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
