import { useState } from "react";
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";

import "~/app.css";

import Nav from "~/components/Nav";
import Footer from "~/components/Footer";
import { DisclaimerAnnouncement } from "~/components/Announcement";

import { CartContext } from "~/lib/cart";
import { cartCookie, createCart, getCart } from "~/lib/cart.server";

export async function loader({ request }: Route.LoaderArgs) {
  const cartId = await cartCookie.parse(request.headers.get("Cookie"));

  let cart = cartId ? await getCart(cartId) : null;

  if (!cart) {
    cart = await createCart();
  }

  return data(
    {
      cart,
    },
    {
      headers: {
        "Set-Cookie": await cartCookie.serialize(cart.id),
      },
    }
  );
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />

        <script
          type="text/javascript"
          src="https://js.authorize.net/v1/Accept.js"
        ></script>
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const [cart, setCart] = useState(loaderData.cart);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <DisclaimerAnnouncement />

      <Nav />

      <main>
        <Outlet />
      </main>

      <Footer />
    </CartContext.Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
