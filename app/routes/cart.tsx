import {
  CreditCardIcon,
  PackageOpenIcon,
  ShieldCheckIcon,
  TrashIcon,
  TruckIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import Button, { IconButton } from "~/components/Button";
import Container from "~/components/Container";
import Input from "~/components/Input";

function CartReservedBanner() {
  const [time, setTime] = useState(60 * 5);

  function getTimeString() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          return 60 * 5;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center mt-4 px-4 py-3 bg-zinc-900 rounded text-white text-sm text-center font-semibold">
      <p>Cart reserved for {getTimeString()}</p>
    </div>
  );
}

export default function Cart() {
  return (
    <div className="px-4 pt-8">
      <Container>
        <div className="flex items-center justify-center text-center md:justify-start md:text-left">
          <h1 className="text-2xl font-bold">Cart (1)</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-4 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="flex flex-col gap-2 items-center justify-center text-center md:items-start md:text-left">
              <div className="relative w-full h-4 bg-zinc-100 rounded-full">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-orange-500 rounded-full"></div>
              </div>

              <p className="font-semibold text-sm">
                🚚 You're only $25 away from Free Shipping!
              </p>
            </div>

            <CartReservedBanner />

            <div className="flex flex-col mt-4 border border-zinc-200 rounded-lg">
              <div className="flex gap-4 p-4 border-t border-zinc-200 first:border-t-0">
                <div className="min-w-20 w-20 h-20 p-2 bg-zinc-100 rounded">
                  <img
                    className="w-full h-full object-contain"
                    src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between gap-4 w-full">
                    <p className="text-lg font-semibold leading-4.5">
                      Geek Bar Pulse X
                    </p>

                    <button>
                      <TrashIcon className="w-4 h-4 text-zinc-500" />
                    </button>
                  </div>

                  <p className="mt-0.5 text-zinc-500 text-sm leading-4">
                    <strong>Flavour:</strong> Blue Razz Ice
                  </p>

                  <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <p className="text-red-500 font-semibold leading-4">
                        $34.99
                      </p>

                      <p className="text-sm text-zinc-500 font-medium line-through">
                        $49.99
                      </p>
                    </div>

                    <Input
                      className="h-8 max-w-16 px-2 text-center"
                      type="number"
                      defaultValue={1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 p-4 border-t border-zinc-200 first:border-t-0">
                <div className="min-w-20 w-20 h-20 p-2 bg-zinc-100 rounded">
                  <img
                    className="w-full h-full object-contain"
                    src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between gap-4 w-full">
                    <p className="text-lg font-semibold leading-4.5">
                      Geek Bar Pulse X
                    </p>

                    <button>
                      <TrashIcon className="w-4 h-4 text-zinc-500" />
                    </button>
                  </div>

                  <p className="mt-0.5 text-zinc-500 text-sm leading-4">
                    <strong>Flavour:</strong> Blue Razz Ice
                  </p>

                  <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <p className="text-red-500 font-semibold leading-4">
                        $34.99
                      </p>

                      <p className="text-sm text-zinc-500 font-medium line-through">
                        $49.99
                      </p>
                    </div>

                    <Input
                      className="h-8 max-w-16 px-2 text-center"
                      type="number"
                      defaultValue={1}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 mt-4">
              <div className="flex flex-col items-center justify-center text-center">
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Secure Checkout
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <CreditCardIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Safe Payment Methods
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <PackageOpenIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Free 14 Days Returns
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <TruckIcon className="w-8 h-8 text-green-600" />

                <p className="mt-1 text-xs text-zinc-500 leading-3.5">
                  Delivery Guarantee
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-zinc-200 rounded-lg">
              <div className="flex p-4">
                <h2 className="text-xl font-semibold leading-5">
                  Order Summary
                </h2>
              </div>

              <div className="flex flex-col p-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <p>Subtotal</p>
                  <p>$34.99</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p>Discounts</p>
                  <p className="text-red-600 font-medium">$15.00</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p>Shipping</p>
                  <p className="text-zinc-500 italic">Next Step</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200 text-lg font-bold">
                  <p>Total</p>
                  <p>$15.00</p>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <Link to="/checkout">
                <Button className="w-full">Checkout (1)</Button>
              </Link>

              <div className="flex items-center justify-center gap-0.5 mt-2">
                <img
                  alt="Diners Club"
                  className="h-6 rounded-xs"
                  src="/img/diners.svg"
                />
                <img
                  alt="Discover"
                  className="h-6 rounded-xs"
                  src="/img/discover.svg"
                />
                <img
                  alt="Mastercard"
                  className="h-6 rounded-xs"
                  src="/img/mastercard.svg"
                />
                <img
                  alt="Visa"
                  className="h-6 rounded-xs"
                  src="/img/visa.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
