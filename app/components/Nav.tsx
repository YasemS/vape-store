import { Link } from "react-router";
import { MenuIcon, ShoppingCartIcon, SearchIcon } from "lucide-react";

import Container from "~/components/Container";

export default function Nav() {
  return (
    <div className="bg-white border-b border-zinc-200 px-4 py-6">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-32 w-32 max-w-32">
            <button
              className="sm:hidden"
              onClick={() => console.log("TODO: setup mobile menu")}
            >
              <MenuIcon className="w-5 h-5 stroke-3" />
            </button>

            <Link className="text-3xl font-black" to="/">
              AY<span className="text-orange-500">VAPES</span>
            </Link>
          </div>

          <div className="hidden items-center gap-8 sm:flex">
            <Link to="/products">Products</Link>
            <Link to="/track">Track Order</Link>
            <Link to="/track">Contact</Link>
          </div>

          <div className="flex items-center justify-end gap-4 min-w-32 w-32 max-w-32">
            <button onClick={() => console.log("TODO: setup search")}>
              <SearchIcon className="w-5 h-5" />
            </button>

            <Link to="/cart">
              <ShoppingCartIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
