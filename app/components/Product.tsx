import { Link } from "react-router";
import { StarIcon } from "lucide-react";

import format from "~/lib/format";

type ProductShort = {
  id: string;
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  brand: {
    name: string;
  };
  images: {
    id: string;
    url: string;
  }[];
};

type ProductGridProps = React.ComponentProps<"div">;
type ProductCardProps = {
  product: ProductShort;
};

export function ProductGrid(props: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4"
      {...props}
    />
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const productImage = product.images[0];

  return (
    <Link className="flex flex-col group" to={`/product/${product.slug}`}>
      <div className="aspect-square p-4 bg-zinc-100 border border-zinc-100 rounded transition-colors hover:border-zinc-200 active:border-zinc-400">
        <img
          alt={product.name}
          className="w-full h-full object-contain transition"
          src={productImage.url}
        />
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-1.5">
          <p className="hidden text-xs text-zinc-500 leading-3 sm:block">
            By <span className="font-medium">{product.brand.name}</span>
          </p>

          <div className="hidden w-px h-3 bg-zinc-500 sm:block"></div>

          <div className="flex items-center gap-1">
            <div className="flex text-orange-500">
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
            </div>

            <p className="mt-0.25 text-zinc-500 text-xs font-medium leading-3">
              {product.rating}
            </p>
          </div>
        </div>

        <p className="mt-1.5 transition font-semibold leading-4 underline decoration-transparent group-hover:decoration-black">
          {product.name}
        </p>

        <p className="mt-1.5 text-red-500 text-sm font-bold leading-3.5">
          {format.currency(product.price)}
        </p>
      </div>
    </Link>
  );
}
