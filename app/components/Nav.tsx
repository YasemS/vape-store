import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { MenuIcon, ShoppingCartIcon, SearchIcon, XIcon } from "lucide-react";

import Container from "~/components/Container";

export default function Nav() {
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mobileMenuBgRef = useRef<HTMLDivElement>(null);

  function onMobileMenuClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === mobileMenuBgRef.current) {
      setShowMobileMenu(false);
    }
  }

  useEffect(() => {
    if (!showMobileMenu) return;

    window.scroll({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  return (
    <>
      <div className="relative h-20 px-4 bg-white border-b border-zinc-200 sm:z-50">
        <Container className="h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2 min-w-32 w-32 max-w-32">
              <button
                className="sm:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <XIcon className="w-5 h-5 stroke-3" />
                ) : (
                  <MenuIcon className="w-5 h-5 stroke-3" />
                )}
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

      {showMobileMenu && (
        <div
          className="fixed top-30 left-0 right-0 bottom-0 bg-black/50 z-10 animate-menu-bg sm:hidden"
          ref={mobileMenuBgRef}
          onClick={onMobileMenuClick}
        >
          <div className="flex flex-col h-full w-full max-w-xs bg-white border-r border-zinc-200 animate-menu-bar">
            <Link className="px-4 py-5 border-b border-zinc-200" to="/products">
              Products
            </Link>
            <Link className="px-4 py-5 border-b border-zinc-200" to="/track">
              Track Your Order
            </Link>
            <Link className="px-4 py-5 border-b border-zinc-200" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
