import {
  CreditCardIcon,
  PackageOpenIcon,
  ShieldCheckIcon,
  TrashIcon,
  TruckIcon,
} from "lucide-react";

import { IconButton } from "~/components/Button";
import Container from "~/components/Container";
import Input from "~/components/Input";

export default function Cart() {
  return (
    <div className="px-4 pt-8">
      <Container>
        <div className="flex items-center justify-center text-center md:justify-start md:text-left">
          <h1 className="text-lg font-bold">Cart (1)</h1>
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

          <div>
            <h2 className="text-lg font-semibold leading-4.5">Order Summary</h2>
          </div>
        </div>
      </Container>
    </div>
  );
}
