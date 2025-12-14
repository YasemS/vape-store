import { ShieldCheckIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "react-router";

export function WhyUsBanner() {
  return (
    <Link
      className="flex items-center px-3 py-2 bg-green-500 text-white text-xs font-semibold sm:px-4 sm:py-3 sm:text-sm"
      to="/products"
    >
      <ShieldCheckIcon className="w-5 h-5 mr-1.5 fill-white stroke-green-500" />
      <p>Safe Payments</p>
      <span className="mx-1">&bull;</span>
      <p>Fast Shipping</p>
      <span className="mx-1">&bull;</span>
      <p>Delivery Guarantee</p>

      <ChevronRightIcon className="w-5 h-5 ml-auto" />
    </Link>
  );
}

export function PaymentDiscountBanner() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 bg-black text-white text-center ">
      <p className="text-xs font-bold leading-3">
        Extra 10% off with certain payment methods!
      </p>
      <p className="mt-1 italic text-[10px] leading-[10px]">
        Includes Apple Pay, Cash App, Venmo, and Zelle. T&Cs apply.
      </p>

      <div className="flex items-center gap-1.5 mt-2">
        <img alt="Apple Pay" className="h-4" src="/img/apple.svg" />
        <img alt="Cash App" className="h-4" src="/img/cash-app.svg" />
        <img alt="Venmo" className="h-4 max-w-10" src="/img/venmo.svg" />
        <img alt="Zelle" className="h-4" src="/img/zelle.svg" />
      </div>
    </div>
  );
}

export function ShippingBanner() {
  return (
    <div className="relative aspect-video overflow-hidden">
      <img
        alt="Shipped from USA Warehouse"
        className="w-full h-full object-cover"
        src="/img/usa-warehouse-banner.jpg"
      />

      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90"></div>

      <div className="flex items-end justify-between gap-4 absolute inset-5">
        <p className="text-white text-2xl font-bold leading-6.5">
          SHIPPED FROM USA WAREHOUSE
        </p>

        <img
          alt="USA"
          className="min-w-16 w-16 -mb-2"
          src="https://flagsapi.com/US/flat/64.png"
        />
      </div>
    </div>
  );
}

export function SupportBanner() {
  return (
    <div className="relative aspect-video overflow-hidden">
      <img
        alt="Rapid Customer Support"
        className="w-full h-full object-cover"
        src="/img/customer-service-banner.jpg"
      />

      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90"></div>

      <div className="flex items-end justify-between gap-4 absolute inset-5">
        <p className="text-white text-2xl font-bold leading-6.5">
          RAPID CUSTOMER SUPPORT
        </p>
      </div>
    </div>
  );
}
