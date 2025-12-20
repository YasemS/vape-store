import { Link, useLoaderData } from "react-router";

import Container from "~/components/Container";
import {
  WhyUsBanner,
  PaymentDiscountBanner,
  ShippingBanner,
  SupportBanner,
} from "~/components/Banner";

import { getProducts } from "~/lib/products.server";
import { ProductCard, ProductGrid } from "~/components/Product";

import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  {
    title: "AYVapes",
  },
];

export async function loader() {
  const products = await getProducts({ take: 8 });

  return {
    products,
  };
}

function Hero() {
  return (
    <Link className="block w-full aspect-2/1 overflow-hidden" to="/products">
      <img
        alt=""
        className="w-full h-full object-cover"
        src="/img/geek-bar-pulse-x-banner.jpg"
      />
    </Link>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <>
      <div className="xl:mt-8">
        <Container>
          <WhyUsBanner />

          <div className="xl:mt-4">
            <Hero />
          </div>
        </Container>
      </div>

      <div className="mt-8 px-4">
        <Container>
          <h2 className="text-xl font-bold sm:text-2xl">🔥 Popular Products</h2>

          <div className="mt-2">
            <ProductGrid>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </div>
        </Container>
      </div>

      <div className="mt-8">
        <Container>
          <PaymentDiscountBanner />
        </Container>
      </div>

      <div className="mt-8 px-4">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ShippingBanner />

            <SupportBanner />
          </div>
        </Container>
      </div>
    </>
  );
}
