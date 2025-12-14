import {
  BadgeCheckIcon,
  CheckCircle2Icon,
  CheckIcon,
  PackageOpen,
  PlaneTakeoffIcon,
  ShieldCheckIcon,
  StarHalfIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, Link } from "react-router";

import Container from "~/components/Container";
import { ProductCard, ProductGrid } from "~/components/Product";

export default function Product() {
  const [saleTimeRemaining, setSaleTimeRemaining] =
    useState<ReturnType<typeof getSaleTimeRemaining>>();

  const cartPopupRef = useRef<HTMLDivElement>(null);
  const atcButtonRef = useRef<HTMLButtonElement>(null);

  const [showProductBar, setShowProductBar] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setShowCartPopup(true);
  }

  function getDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate;
  }

  function getSaleTimeRemaining() {
    const now = new Date();

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const timeRemaining = endOfDay.getTime() - now.getTime();

    const hours = Math.floor(timeRemaining / 1000 / 60 / 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return {
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSaleTimeRemaining(getSaleTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!atcButtonRef.current) return;

    function onScroll() {
      if (
        window.scrollY + window.innerHeight >=
        document.body.offsetHeight - 100
      ) {
        setShowProductBar(false);
        return;
      }

      // set product bar to true if user gone past the ATC button
      const atcButtonBottom = atcButtonRef.current!.getBoundingClientRect().top;

      if (atcButtonBottom <= 0) {
        setShowProductBar(true);
      } else {
        setShowProductBar(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [atcButtonRef]);

  useEffect(() => {
    if (!showCartPopup) return;

    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCartPopup]);

  useEffect(() => {
    if (!cartPopupRef.current || !showCartPopup) return;

    function onClickOutside(e: MouseEvent) {
      if (!cartPopupRef.current!.contains(e.target as Node)) {
        setShowCartPopup(false);
      }
    }

    document.addEventListener("click", onClickOutside);

    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, [cartPopupRef, showCartPopup]);

  return (
    <>
      <div className="md:px-4 md:mt-8">
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 xl:gap-8">
            <div>
              <div className="sticky top-4">
                <div className="aspect-square p-8 bg-zinc-100 md:rounded-lg">
                  <img
                    alt=""
                    className="w-full h-full object-contain"
                    src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                  />
                </div>

                <div className="flex items-center gap-1 p-2 overflow-auto scroll-hidden md:px-0">
                  <button className="min-w-16 w-16 h-16 p-2 bg-zinc-100 border border-zinc-100 rounded transition cursor-pointer hover:border-zinc-200 active:border-zinc-400">
                    <img
                      src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                      alt=""
                    />
                  </button>

                  <button className="min-w-16 w-16 h-16 p-2 bg-zinc-100 border border-zinc-100 rounded transition cursor-pointer hover:border-zinc-200 active:border-zinc-400">
                    <img
                      src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                      alt=""
                    />
                  </button>
                </div>

                <div className="flex bg-orange-500 text-white overflow-hidden md:rounded">
                  <img
                    className="w-32 min-w-32 md:w-40 md:min-w-40"
                    src="/img/lightning-deal.avif"
                    alt="Lightning Deal"
                  />

                  <div className="flex items-center gap-2 pl-1 lg:gap-4 lg:pl-3">
                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-5 min-w-5" />
                      <p className="text-sm font-medium">Save 20% Off</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-5 min-w-5" />
                      <p className="text-sm font-medium">Free Shipping</p>
                    </div>

                    <div className="hidden items-center gap-1 sm:flex md:hidden lg:flex">
                      <CheckIcon className="w-5 min-w-5" />
                      <p className="text-sm font-medium">Refund Guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 md:px-0">
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium leading-3.5">
                <TruckIcon className="w-4 h-4" />

                <p>
                  Arrives by{" "}
                  <span className="font-semibold">
                    {getDeliveryDate().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>

              <h1 className="mt-1 text-2xl font-bold scroll-mt-20" id="main">
                Geek Bar Pulse X
              </h1>

              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center text-sm">
                  <p className="text-zinc-500">22k Sold</p>

                  <span className="mx-1.5 text-zinc-500 text-xs">|</span>

                  <p>
                    By{" "}
                    <Link className="font-medium" to="/brand/geek-bar">
                      Geek Bar
                    </Link>
                  </p>

                  <BadgeCheckIcon className="w-5 h-5 ml-0.5 fill-blue-500 text-white" />
                </div>

                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium">
                  <p>Excellent 4.7</p>
                  <StarIcon className="w-5 h-5 fill-orange-500" />
                </div>
              </div>

              <div className="flex mt-2">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-600 rounded-br-xl rounded-tl-xl text-white text-xs font-semibold">
                  <CheckIcon className="w-4 h-4 stroke-3" />
                  <p>Top 10 Best Seller</p>
                </div>
              </div>

              <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between px-3 pt-2 pb-4 bg-orange-500 border-b-0 rounded-t-lg text-white">
                  <div className="flex items-center gap-2">
                    <ZapIcon className="w-4 h-4 fill-white" />
                    <p className="text-sm font-semibold">Limited Time Sale</p>
                  </div>

                  {saleTimeRemaining && (
                    <p className="text-xs">
                      Ends In:{" "}
                      <span className="inline-block min-w-7 w-7 py-0.5 bg-white rounded text-orange-500 text-center font-semibold">
                        {saleTimeRemaining.hours}h
                      </span>{" "}
                      <span className="inline-block min-w-8 w-8 py-0.5 bg-white rounded text-orange-500 text-center font-semibold">
                        {saleTimeRemaining.minutes}m
                      </span>{" "}
                      <span className="inline-block min-w-7 w-7 py-0.5 bg-white rounded text-orange-500 text-center font-semibold">
                        {saleTimeRemaining.seconds}s
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 -mt-2 p-3 bg-white border-2 border-orange-500 rounded-lg">
                  <div className="flex items-center gap-1">
                    <TagIcon className="w-6 h-6 fill-red-500 text-white" />

                    <p className="text-red-500 text-2xl font-bold leading-6">
                      $39.99
                    </p>
                  </div>

                  <p className="font-semibold line-through leading-4">$49.99</p>

                  <div className="flex items-center gap-1 px-1 py-0.5 bg-orange-50 border border-dashed border-orange-500 rounded text-orange-500 text-xs font-semibold">
                    20% OFF
                  </div>
                </div>
              </div>

              <div className="mt-1 text-zinc-500 text-xs">
                <p className="text-red-500">Special Offer</p>
                <p>
                  Free shipping on orders over $50. Incl. tax and additional
                  charges.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-orange-50 border border-orange-500 rounded text-sm font-medium">
                <PlaneTakeoffIcon className="w-5 h-5" />

                <p>
                  Shipped from{" "}
                  <span className="text-orange-500 font-semibold underline">
                    Miami, FL
                  </span>
                </p>

                <img
                  alt=""
                  className="w-6 h-6"
                  src="https://flagsapi.com/US/shiny/32.png"
                />
              </div>

              <Form
                className="flex flex-col gap-4 mt-6 pt-6 border-t border-zinc-200"
                onSubmit={onFormSubmit}
              >
                <div className="flex flex-col gap-1 max-w-1/2 lg:max-w-1/3 xl:max-w-1/4">
                  <label
                    className="text-sm font-medium leading-3.5"
                    htmlFor="quantity"
                  >
                    Quantity
                  </label>

                  <input
                    className="h-12 w-full px-3 appearance-none bg-white border border-zinc-200 rounded outline-none transition-all placeholder:text-black/30 hover:border-zinc-400 focus:border-orange-500"
                    name="quantity"
                    id="quantity"
                    type="number"
                    min={1}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="text-sm font-medium leading-3.5"
                    htmlFor="flavour"
                  >
                    Flavour
                  </label>

                  <select
                    className="h-12 w-full px-3 appearance-none bg-white border border-zinc-200 rounded outline-none transition-all placeholder:text-black/30 hover:border-zinc-400 focus:border-orange-500"
                    name="flavour"
                    id="flavour"
                  >
                    <option disabled value="">
                      Select a flavour
                    </option>
                    <option value="">Blue Razz Ice</option>
                  </select>
                </div>

                <button
                  className="flex flex-col items-center justify-center gap-1 h-12 px-4 bg-orange-500 rounded-full transition text-white cursor-pointer hover:scale-102 active:scale-103"
                  ref={atcButtonRef}
                >
                  <p className="text-lg font-bold leading-4.5">Add to cart</p>
                  <p className="text-xs leading-3">20% OFF</p>
                </button>
              </Form>

              <div className="mt-6 pt-6 border-t border-zinc-200">
                <div className="flex items-center gap-1">
                  <BadgeCheckIcon className="w-6 h-6 fill-green-600 text-white" />
                  <p className="text-green-600 font-medium">
                    Why Choose AYVAPES?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-1 mt-1 pl-7 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                  <div className="flex flex-col gap-1 w-full px-3 py-2 bg-zinc-50 rounded text-sm">
                    <p className="text-green-600 font-medium">
                      Secure Payments
                    </p>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 stroke-3 text-green-600" />
                      <p className="text-zinc-500 text-xs">Safe Checkout</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 stroke-3 text-green-600" />
                      <p className="text-zinc-500 text-xs">Encrypted Data</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full px-3 py-2 bg-zinc-50 rounded text-sm">
                    <p className="text-green-600 font-medium">
                      Delivery Guarantee
                    </p>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 stroke-3 text-green-600" />
                      <p className="text-zinc-500 text-xs">
                        15 Day No Update Refund
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 stroke-3 text-green-600" />
                      <p className="text-zinc-500 text-xs">
                        30 Day Refund Guarantee
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full px-3 py-2 bg-zinc-50 rounded text-sm">
                    <p className="text-green-600 font-medium">USA Warehouse</p>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 stroke-3 text-green-600" />
                      <p className="text-zinc-500 text-xs">Shipped from USA</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 stroke-3 text-green-600" />
                      <p className="text-zinc-500 text-xs">Fast Shipping</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <PackageOpen className="w-5 h-5" />
                    <p>Free Returns</p>
                    <span className="text-xs">&bull;</span>
                    <p>Fast Shipping</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200">
                <h2 className="text-xl font-semibold">
                  About the Geek Bar Pulse X
                </h2>

                <p className="mt-1 text-sm">
                  The Geek Bar Pulse X is a high-performance disposable vape
                  designed for long-lasting enjoyment. It offers up to 25,000
                  puffs in regular mode and 15,000 in pulse mode, minimizing the
                  need for frequent replacements. With an 18ml e-liquid capacity
                  and dual mesh coil, it delivers smooth, flavorful vapor. An
                  innovative 3D display lets you easily check both e-liquid and
                  battery levels.
                </p>

                <h2 className="text-xl font-semibold mt-4">Specifications</h2>

                <ul className="mt-1 pl-2 list-disc list-inside text-sm">
                  <li>
                    <strong>Brand:</strong> Geek Bar
                  </li>

                  <li>
                    <strong>Nicotine:</strong> 5%
                  </li>
                  <li>
                    <strong>Puff Count:</strong> 15K - 25K
                  </li>
                  <li>
                    <strong>Charging:</strong> USB-C
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="px-4">
        <Container>
          <hr className="my-12 border-zinc-200" />

          <div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold">2,699 Reviews</p>

                <span className="text-xs">|</span>

                <div className="flex items-center gap-0.5 text-orange-500">
                  <p className="font-medium mr-0.5">4.7</p>

                  <StarIcon className="w-5 h-5 fill-orange-500" />
                  <StarIcon className="w-5 h-5 fill-orange-500" />
                  <StarIcon className="w-5 h-5 fill-orange-500" />
                  <StarIcon className="w-5 h-5 fill-orange-500" />

                  <div className="relative">
                    <StarIcon className="w-5 h-5 fill-zinc-200 text-zinc-200" />
                    <StarHalfIcon className="absolute top-0 left-0 w-5 h-5 fill-orange-500" />
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-1 bg-green-100 rounded overflow-hidden">
                <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white">
                  <ShieldCheckIcon className="w-5 h-5 fill-white text-green-600" />
                </div>

                <p className="px-2 text-sm text-green-600 font-medium">
                  All from verified purchases
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
              <div className="py-4 border-b border-zinc-200 rounded first:pt-0 sm:border sm:p-3 sm:first:pt-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center min-w-10 w-10 h-10 bg-orange-500 rounded-full text-white">
                    <span>J</span>
                  </div>

                  <div>
                    <p className="font-semibold leading-4">John Doe</p>
                    <p className="mt-1 text-xs text-zinc-500 leading-3">
                      December 18, 2025
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-4.5">
                  All smoke shops ran out, I looked for websites that sell them
                  got scammed on some other websites but this one was legit and
                  it got here less then a week and they through in an extra vape
                  I wasn&apos;t expecting🔥🔥🔥
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button className="min-w-16 w-16 h-16 rounded overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src="https://puffplayground.com/wp-content/uploads/2025/09/image-8-scaled.jpg"
                      alt=""
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-0.25 text-orange-500">
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                  </div>

                  <p className="text-sm font-semibold leading-3.5">Rated 4.0</p>
                </div>
              </div>

              <div className="py-4 border-b border-zinc-200 rounded first:pt-0 sm:border sm:p-3 sm:first:pt-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center min-w-10 w-10 h-10 bg-orange-500 rounded-full text-white">
                    <span>J</span>
                  </div>

                  <div>
                    <p className="font-semibold leading-4">John Doe</p>
                    <p className="mt-1 text-xs text-zinc-500 leading-3">
                      December 18, 2025
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-4.5">
                  All smoke shops ran out, I looked for websites that sell them
                  got scammed on some other websites but this one was legit and
                  it got here less then a week and they through in an extra vape
                  I wasn&apos;t expecting🔥🔥🔥
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button className="min-w-16 w-16 h-16 rounded overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src="https://puffplayground.com/wp-content/uploads/2025/09/image-8-scaled.jpg"
                      alt=""
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-0.25 text-orange-500">
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                    <StarIcon className="w-4 h-4 fill-orange-500" />
                  </div>

                  <p className="text-sm font-semibold leading-3.5">Rated 4.0</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="hidden my-12 border-zinc-200 sm:block" />

          <div className="mt-8 sm:mt-0">
            <h2 className="text-xl font-bold sm:text-2xl">
              🛍️ Related Products
            </h2>

            <div className="mt-2">
              <ProductGrid>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
              </ProductGrid>
            </div>
          </div>
        </Container>
      </div>

      {showProductBar && (
        <div className="fixed bottom-0 left-0 right-0 py-3 px-4 bg-white border-y border-zinc-200 animate-product-bar z-10 md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-16 w-16 h-16 bg-zinc-100 rounded">
              <img
                className="w-full h-full p-2 object-contain"
                src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                alt=""
              />
            </div>

            <div>
              <p className="text-lg font-bold leading-4.5">Geek Bar Pulse X</p>
              <p className="mt-1 text-red-500 font-semibold leading-4">
                $34.99
              </p>
            </div>

            <Link
              className="flex items-center ml-auto px-8 h-12 bg-orange-500 rounded-full text-white font-bold"
              to="#main"
            >
              Buy
            </Link>
          </div>
        </div>
      )}

      {showCartPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 animate-cart-bg z-20 sm:px-4">
          <Container className="relative w-full h-full">
            <div
              className="absolute bottom-0 left-0 w-full p-4 bg-white rounded-t-xl animate-cart-popup sm:top-30 sm:bottom-auto sm:left-auto sm:right-0 sm:-translate-y-[px] sm:max-w-md sm:py-5 sm:rounded-t-none sm:rounded-b-xl z-60"
              ref={cartPopupRef}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="w-8 h-8 text-white fill-green-600" />

                  <p className="text-lg font-semibold">Added to Cart</p>
                </div>

                <button
                  className="flex items-center justify-center w-10 h-10 bg-zinc-100 rounded-full"
                  onClick={() => setShowCartPopup(false)}
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <div className="min-w-20 w-20 h-20 bg-zinc-100 rounded">
                  <img
                    className="w-full h-full p-2 object-contain"
                    src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                    alt=""
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold leading-4.5">
                    Geek Bar Pulse X
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 leading-3.5">
                    Flavor: Blue Razz Ice
                  </p>
                </div>

                <p className="ml-auto text-red-500 font-semibold leading-4">
                  $34.99
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button className="flex items-center justify-center px-8 h-12 bg-orange-500 rounded-full text-white font-bold">
                  Checkout
                </button>

                <button className="flex items-center justify-center px-8 h-12 bg-white border border-zinc-500 rounded-full text-black font-bold">
                  View Cart (1)
                </button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
