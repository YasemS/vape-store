import { Fragment, useEffect, useRef, useState } from "react";
import { redirect } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import {
  BanknoteIcon,
  CheckIcon,
  HouseIcon,
  MailIcon,
  MoveRightIcon,
  PackageOpenIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import QRCode from "react-qr-code";

import Button from "~/components/Button";
import Container from "~/components/Container";

import cn from "~/lib/cn";
import format from "~/lib/format";
import prisma from "~/lib/prisma.server";

import type { Route } from "./+types/order.$id";
import type { OrderStatus as OrderStatusEnum } from "generated/prisma/enums";

export const meta: Route.MetaFunction = () => [
  {
    title: "Order - AYVapes",
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const order = await prisma.order.findUnique({
    include: {
      items: {
        include: {
          variants: true,
        },
      },
    },
    where: {
      id: params.id,
    },
  });

  if (!order) {
    return redirect("/track");
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      images: {
        select: {
          id: true,
          url: true,
        },
        orderBy: {
          url: "asc",
        },
      },
      variants: {
        select: {
          id: true,
          name: true,
          options: {
            select: {
              id: true,
              name: true,
              imageId: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    where: {
      id: {
        in: order.items.map((item) => item.productId),
      },
    },
  });

  const result = [];

  for (const item of order.items) {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      continue;
    }

    let image = product.images[0];

    const variants = [];

    for (const variant of product.variants) {
      const selectedVariant = item.variants.find(
        (v) => v.variantId === variant.id
      );

      if (!selectedVariant) {
        continue;
      }

      const selectedOption = variant.options.find(
        (option) => option.id === selectedVariant.optionId
      );

      if (!selectedOption) {
        continue;
      }

      if (selectedOption.imageId) {
        image =
          product.images.find((image) => image.id === selectedOption.imageId) ||
          image;
      }

      variants.push({
        ...selectedVariant,
        name: variant.name,
        value: selectedOption.name,
      });
    }

    result.push({
      ...item,
      name: product.name,
      image,
      variants,
    });
  }

  return {
    order: {
      id: order.id,
      status: order.status,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      address: order.address,
      address2: order.address2,
      city: order.city,
      state: order.state,
      postal: order.postal,
      country: order.country,
      shippingMethod: order.shippingMethod,
      paymentMethod: order.paymentMethod,
      items: result,
      total: order.total,
    },
    config: {
      google: {
        maps: {
          apiKey: process.env.GOOGLE_MAPS_KEY || "",
        },
      },
    },
  };
}

export default function Order({
  loaderData: { order, config },
}: Route.ComponentProps) {
  const mapAddress =
    order.address +
    ", " +
    order.city +
    ", " +
    order.state +
    " " +
    order.postal +
    ", " +
    order.country;

  const paymentInfoRef = useRef<HTMLDivElement>(null);

  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  function onPaymentInfoClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === paymentInfoRef.current) {
      setShowPaymentInfo(false);
    }
  }

  useEffect(() => {
    document.body.style.overflow = showPaymentInfo ? "hidden" : "auto";
  }, [showPaymentInfo]);

  return (
    <>
      <Container className="max-w-3xl">
        <div className="aspect-3/4 overflow-hidden sm:aspect-4/3 md:aspect-3/2 md:mt-8 md:rounded-lg">
          <OrderMapContainer
            address={mapAddress}
            apiKey={config.google.maps.apiKey}
          />
        </div>

        <div className="relative -mt-8 bg-white rounded-t-3xl z-1 shadow-[0_-5px_5px_0_rgba(0,0,0,0.1)] md:mt-0 md:rounded-none md:shadow-none">
          <div className="p-6">
            {order.status === "AWAITING_PAYMENT" ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-red-500">
                  <TriangleAlertIcon className="w-6 h-6" />
                  <p className="text-xl font-medium">
                    Awaiting{" "}
                    {format.capitalize(
                      order.paymentMethod.split("-").join(" ")
                    )}{" "}
                    Payment
                  </p>
                </div>

                <p className="mt-2 text-sm text-zinc-500 leading-4">
                  Your order will not be processed until payment is received and
                  confirmed.
                </p>

                <Button
                  className="w-full mt-3"
                  onClick={() => setShowPaymentInfo(true)}
                >
                  <span>View Payment Steps</span>
                  <MoveRightIcon className="w-6 h-6 ml-1" />
                </Button>
              </div>
            ) : (
              <OrderStatus status={order.status} />
            )}
          </div>

          <div className="p-6 border-t border-zinc-200 md:px-0">
            <p className="text-lg font-medium">Contact</p>

            <div className="flex gap-2 mt-2">
              <UserIcon className="w-4 h-4" />
              <p className="text-sm leading-4">
                {order.firstName} {order.lastName}
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              <MailIcon className="w-4 h-4" />
              <p className="text-sm leading-4">{order.email}</p>
            </div>

            <div className="flex gap-2 mt-2">
              <BanknoteIcon className="w-4 h-4" />
              <p className="text-sm leading-4">
                {format.capitalize(order.paymentMethod.split("-").join(" "))}
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-zinc-200 md:px-0">
            <p className="text-lg font-medium">Delivery</p>

            <div className="flex gap-2 mt-2">
              <HouseIcon className="w-4 h-4" />
              <p className="text-sm leading-4">
                {order.address}, {order.address2 ? order.address2 + ", " : ""}
                <br />
                {order.city} {order.state} {order.postal} {order.country}
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              <TruckIcon className="w-4 h-4" />
              <p className="text-sm leading-4">
                {format.capitalize(order.shippingMethod.split("-").join(" "))}
              </p>
            </div>
          </div>

          <div className="p-6 pb-0 border-t border-zinc-200 md:px-0">
            <p className="text-lg font-medium">Item(s)</p>

            <div className="flex flex-col mt-2">
              {order.items.map((item) => (
                <div
                  className="flex gap-4 py-4 border-t border-zinc-200 first:pt-0 last:pb-0 first:border-t-0"
                  key={item.id}
                >
                  <div className="min-w-16 w-16 h-16 p-2 bg-zinc-100 border border-zinc-200 rounded">
                    <img
                      alt={item.name}
                      className="w-full h-full object-contain"
                      src={item.image.url}
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="flex items-start justify-between gap-4 w-full">
                      <p className="font-semibold leading-4">
                        {item.quantity} x {item.name}
                      </p>
                    </div>

                    <p className="mt-0.5 text-zinc-500 text-xs leading-3.5">
                      {item.variants.map((variant, index) => (
                        <Fragment key={variant.variantId}>
                          <strong>{variant.name}:</strong> {variant.value}
                          {index !== item.variants.length - 1 && ", "}
                        </Fragment>
                      ))}
                    </p>

                    <div className="flex items-end justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-red-500 font-semibold leading-3.5">
                          {format.currency(item.price * item.quantity)}
                        </p>

                        <p className="text-xs text-zinc-500 font-medium line-through leading-3">
                          {format.currency(
                            (item.price / 80) * 100 * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {showPaymentInfo && (
        <div
          className="flex items-center justify-center fixed top-0 left-0 w-full h-full p-4 bg-black/50 z-100"
          ref={paymentInfoRef}
          onClick={onPaymentInfoClick}
        >
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-lg shadow shadow-black/50">
            <div className="flex items-center justify-center p-4 text-center">
              <p className="text-lg font-semibold leading-4.5">
                Payment Instructions
              </p>
            </div>

            <div className="px-4 py-6 border-t border-zinc-200">
              {order.paymentMethod === "cash-app" ? (
                <OrderCashAppInstructions total={order.total} />
              ) : (
                <OrderZelleInstructions total={order.total} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type OrderMapProps = {
  address: string;
  apiKey: string;
};

function OrderMapContainer({ address, apiKey }: OrderMapProps) {
  return (
    <ClientOnly>
      {() => (
        <APIProvider apiKey={apiKey}>
          <OrderMap address={address} />
        </APIProvider>
      )}
    </ClientOnly>
  );
}

function OrderMap({ address }: { address: string }) {
  const [coords, setCoords] = useState<google.maps.LatLngLiteral | null>(null);

  const geocoding = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!geocoding) return;

    const geocoder = new geocoding.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setCoords({ lat: lat(), lng: lng() });
      } else {
        console.error("Geocoding failed:", status);
      }
    });
  }, [geocoding, address]);

  if (!coords) return null;

  return (
    <Map
      zoom={16}
      center={coords}
      cameraControl={false}
      colorScheme="LIGHT"
      streetViewControl={false}
      fullscreenControl={false}
      mapTypeControl={false}
      keyboardShortcuts={false}
      gestureHandling="none"
    >
      <Marker position={coords} />
    </Map>
  );
}

function OrderStatus({ status }: { status: OrderStatusEnum }) {
  return (
    <div className="relative">
      <div className="absolute top-6 left-0 w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
        <div
          className="w-full h-full bg-orange-500"
          style={{
            width:
              status === "PROCESSING"
                ? "66.66%"
                : status === "FULFILLED"
                ? "100%"
                : "0",
          }}
        ></div>
      </div>

      <div className="flex items-center justify-between relative z-1">
        <div className="flex flex-col items-center justify-center gap-1 w-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500">
            <CheckIcon className="w-6 h-6 text-white" />
          </div>

          <p className="text-xs text-zinc-500 font-medium">Ordered</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 w-12 text-center">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              status === "AWAITING_PAYMENT"
                ? "bg-white border border-black"
                : "bg-orange-500 text-white"
            )}
          >
            {status === "AWAITING_PAYMENT" ? (
              <BanknoteIcon className="w-6 h-6" />
            ) : (
              <CheckIcon className="w-6 h-6" />
            )}
          </div>

          <p className="text-xs text-zinc-500 font-medium">Paid</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 w-12 text-center">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              status === "AWAITING_PAYMENT"
                ? "bg-white border border-black"
                : "bg-orange-500 text-white"
            )}
          >
            {status === "AWAITING_PAYMENT" ? (
              <PackageOpenIcon className="w-6 h-6" />
            ) : (
              <CheckIcon className="w-6 h-6" />
            )}
          </div>

          <p className="text-xs text-zinc-500 font-medium">Processing</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 w-12 text-center">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              status !== "FULFILLED"
                ? "bg-white border border-black"
                : "bg-orange-500 text-white"
            )}
          >
            {status === "AWAITING_PAYMENT" ? (
              <TruckIcon className="w-6 h-6" />
            ) : (
              <CheckIcon className="w-6 h-6" />
            )}
          </div>

          <p className="text-xs text-zinc-500 font-medium">Shipped</p>
        </div>
      </div>
    </div>
  );
}

function OrderCashAppInstructions({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm">
        Pay by sending <strong>{format.currency(total)}</strong> to the Cash App
        QR or tag below
      </p>

      <ClientOnly>
        {() => (
          <QRCode
            className="w-40 h-40"
            value="https://cash.app/$pufflyio?qr=1"
          />
        )}
      </ClientOnly>

      <p className="text-xl font-bold leading-5">$pufflyio</p>

      <p className="-mt-2 text-xs">
        Please send the payment via Cash App, your order will be processed once
        the payment is received.
      </p>
    </div>
  );
}

function OrderZelleInstructions({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm">
        Pay by sending <strong>{format.currency(total)}</strong> to the Zelle QR
        or number below
      </p>

      <ClientOnly>
        {() => (
          <QRCode
            className="w-40 h-40"
            value="https://www.zellepay.com/qr-codes/?data=eyJ0b2tlbiI6Ijc4Ni01NjYtMzMzMCIsIm5hbWUiOiJBTlRIT05ZIFJJVkVSTyJ9"
          />
        )}
      </ClientOnly>

      <p className="text-xl font-bold leading-5">+1 (786) 566-3330</p>

      <p className="-mt-2 text-xs">
        Please send the payment via Zelle, your order will be processed once the
        payment is received.
      </p>
    </div>
  );
}
