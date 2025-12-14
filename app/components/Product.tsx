import { Link } from "react-router";
import { StarIcon } from "lucide-react";

type ProductGridProps = React.ComponentProps<"div">;

export function ProductGrid(props: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4"
      {...props}
    />
  );
}

export function ProductCard() {
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
            <div className="flex text-orange-500">
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
              <StarIcon className="w-3 h-3 fill-orange-500" />
            </div>

            <p className="mt-0.25 text-zinc-500 text-xs font-medium leading-3">
              5.0
            </p>
          </div>
        </div>

        <p className="mt-1.5 transition font-semibold leading-4 underline decoration-transparent group-hover:decoration-black">
          Geek Bar Pulse X
        </p>

        <p className="mt-1.5 text-red-500 text-sm font-bold leading-3.5">
          $34.99
        </p>
      </div>
    </Link>
  );
}
