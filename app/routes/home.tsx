import { StarIcon } from "lucide-react";
import { Link } from "react-router";

import Container from "~/components/Container";
import {
  WhyUsBanner,
  PaymentDiscountBanner,
  ShippingBanner,
  SupportBanner,
} from "~/components/Banner";

function Hero() {
  return (
    <Link className="aspect-2/1 overflow-hidden" to="/products">
      <img
        alt=""
        className="w-full h-full object-cover"
        src="/img/geek-bar-pulse-x-banner.jpg"
      />
    </Link>
  );
}

type ProductGridProps = React.ComponentProps<"div">;

function ProductGrid(props: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4"
      {...props}
    />
  );
}

function ProductCard() {
  return (
    <Link className="flex flex-col group" to="/product/test">
      <div className="aspect-square bg-zinc-100 p-4">
        <img
          alt=""
          className="w-full h-full object-contain transition group-hover:-translate-y-1"
          src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
        />
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-1.5">
          <p className="hidden text-xs text-zinc-500 leading-3 sm:block">
            By <span className="font-medium">Geek Bar</span>
          </p>

          <div className="hidden w-px h-3 bg-zinc-500 sm:block"></div>

          <div className="flex items-center gap-1">
            <div className="flex text-yellow-500">
              <StarIcon className="w-3 h-3 fill-yellow-500" />
              <StarIcon className="w-3 h-3 fill-yellow-500" />
              <StarIcon className="w-3 h-3 fill-yellow-500" />
              <StarIcon className="w-3 h-3 fill-yellow-500" />
              <StarIcon className="w-3 h-3 fill-yellow-500" />
            </div>

            <p className="mt-0.25 text-zinc-500 text-xs font-medium leading-3">
              5.0
            </p>
          </div>
        </div>

        <p className="mt-1.5 transition font-semibold leading-4 underline decoration-transparent group-hover:decoration-black">
          Geek Bar Pulse X
        </p>

        <p className="mt-1.5 text-red-500 text-sm font-semibold leading-3.5">
          $34.99
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
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
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
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
