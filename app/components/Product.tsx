import { Link } from "react-router";
import { StarHalfIcon, StarIcon } from "lucide-react";

import format from "~/lib/format";
import cn from "~/lib/cn";

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

type ProductStarsProps = {
  rating: number;
  size?: "sm" | "base" | "lg";
};

export function ProductStars({ rating, size = "base" }: ProductStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizes = {
    sm: "w-3 h-3",
    base: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const sizeClass = sizes[size];

  return (
    <div className="flex gap-0.25 text-orange-500">
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon className={cn("fill-orange-500", sizeClass)} key={i} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <StarIcon className={cn("fill-zinc-200 text-zinc-200", sizeClass)} />
          <StarHalfIcon
            className={cn("absolute top-0 left-0 fill-orange-500", sizeClass)}
          />
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon
          className={cn("fill-zinc-200 text-zinc-200", sizeClass)}
          key={i}
        />
      ))}
    </div>
  );
}

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
      <div className="w-full aspect-square p-4 bg-zinc-100 border border-zinc-100 rounded transition-colors hover:border-zinc-200 active:border-zinc-400">
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
            <ProductStars rating={product.rating} size="sm" />

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
