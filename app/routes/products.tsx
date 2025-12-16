import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { ChevronDownIcon } from "lucide-react";

import Container from "~/components/Container";
import { ProductCard, ProductGrid } from "~/components/Product";

import cn from "~/lib/cn";
import { getProducts } from "~/lib/products.server";
import Button from "~/components/Button";

export async function loader() {
  const products = await getProducts();

  return { products };
}

export default function Products() {
  const { products } = useLoaderData<typeof loader>();

  const [sortBy, setSortBy] = useState("best_selling");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortRef.current || !showSortOptions) {
      return;
    }

    function onClickOutside(e: MouseEvent) {
      if (!sortRef.current?.contains(e.target as Node)) {
        setShowSortOptions(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [showSortOptions, sortRef]);

  return (
    <div className="px-4 pt-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Products (400)</h1>

          <div className="relative" ref={sortRef}>
            <Button
              className={cn(
                "px-4 h-10 text-zinc-500 text-sm font-medium",
                showSortOptions && "text-black"
              )}
              variant="secondary"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <span>Sort By</span>
              <ChevronDownIcon
                className={cn(
                  "w-4 h-4 transition-transform",
                  showSortOptions && "rotate-180"
                )}
              />
            </Button>

            {showSortOptions && (
              <div className="flex flex-col items-start absolute top-full right-0 translate-y-1 min-w-48 px-4 py-3 bg-white border border-zinc-200 rounded-lg animate-dropdown">
                <button className="text-left font-semibold underline">
                  Best Selling
                </button>

                <button className="transition text-left underline decoration-transparent cursor-pointer hover:decoration-black">
                  Name: A-Z
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </div>
      </Container>
    </div>
  );
}
