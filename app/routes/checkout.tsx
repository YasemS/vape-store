import {
  CreditCardIcon,
  LockIcon,
  PackageOpenIcon,
  SearchIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";
import { Fragment, useRef, useState } from "react";
import { Link, redirect } from "react-router";
import {
  usePlacesWidget,
  type ReactGoogleAutocompleteProps,
} from "react-google-autocomplete";
import { ClientOnly } from "remix-utils/client-only";
import QRCode from "react-qr-code";

import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import Container from "~/components/Container";
import Input, { type InputProps } from "~/components/Input";
import InputGroup from "~/components/InputGroup";
import Label from "~/components/Label";
import Radio from "~/components/Radio";
import Select from "~/components/Select";
import {
  PaymentMethodContainer,
  PaymentMethodButton,
  PaymentMethodContent,
  PaymentMethodIcons,
  PaymentMethodIcon,
} from "~/components/Checkout";

import cn from "~/lib/cn";
import format from "~/lib/format";
import prisma from "~/lib/prisma.server";
import { cartCookie, getCart } from "~/lib/cart.server";

import type { Route } from "./+types/checkout";

const shippingOptions = [
  {
    id: "standard-shipping",
    name: "Standard Shipping",
    price: 3.99,
    freeThreshold: 50,
    estimatedDays: 5,
  },
  {
    id: "express-shipping",
    name: "Express Shipping",
    price: 9.99,
    freeThreshold: 200,
    estimatedDays: 2,
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const cartId = await cartCookie.parse(request.headers.get("Cookie"));

  if (!cartId) {
    return redirect("/");
  }

  const cart = await getCart(cartId);

  if (!cart) {
    return redirect("/");
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
        in: cart.items.map((item) => item.productId),
      },
    },
  });

  const result = [];

  for (const item of cart.items) {
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
      price: product.price,
      image,
      variants,
    });
  }

  return {
    cart: {
      id: cart.id,
      items: result,
    },
  };
}

export default function Checkout({ loaderData }: Route.ComponentProps) {
  const { cart } = loaderData;

  const address2Ref = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("us");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");

  const [shippingId, setShippingId] = useState<string>(shippingOptions[0].id);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardPostal, setCardPostal] = useState("");

  const [isAddressManual, setIsAddressManual] = useState(false);
  const [showAddressFull, setShowAddressFull] = useState(false);

  const cartSubtotal = cart.items.reduce(
    (acc, item) => acc + (item.price / 80) * 100 * item.quantity,
    0
  );

  const cartDiscount = cart.items.reduce(
    (acc, item) => (item.price / 80) * 100 * 0.2 * item.quantity + acc,
    0
  );

  const shippingOption = shippingOptions.find(
    (option) => option.id === shippingId
  );

  const shippingTotal = shippingOption
    ? cartSubtotal - cartDiscount >= shippingOption.freeThreshold
      ? 0
      : shippingOption.price
    : 0;

  const cartTotal = cartSubtotal - cartDiscount + shippingTotal;

  function getCardBrand(input?: string) {
    const cleaned = (input ?? cardNumber).replace(/\D/g, "");

    if (/^4/.test(cleaned)) {
      return "VISA";
    } else if (
      /^5[1-5]/.test(cleaned) ||
      /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cleaned)
    ) {
      return "MASTERCARD";
    } else if (/^3[47]/.test(cleaned)) {
      return "AMEX";
    } else if (
      /^6011/.test(cleaned) ||
      /^65/.test(cleaned) ||
      /^64[4-9]/.test(cleaned) ||
      /^(62212[6-9]|6221[3-9]\d|622[2-8]\d{2}|6229[01]\d|62292[0-5])/.test(
        cleaned
      )
    ) {
      return "DISCOVER";
    }

    return null;
  }

  function onPlaceSelected(place: any) {
    if (!place || !place.address_components) {
      return;
    }

    const components = place.address_components;

    if (!components || !Array.isArray(components)) {
      return;
    }

    const data = {
      address: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      postal: "",
    };

    for (const component of components) {
      if (component.types.includes("street_number")) {
        data.address += component.long_name + " ";
      }

      if (component.types.includes("route")) {
        data.address += component.long_name;
      }

      if (
        component.types.includes("locality") ||
        component.types.includes("postal_town")
      ) {
        data.city = component.long_name;
      }

      if (component.types.includes("administrative_area_level_1")) {
        data.state = component.short_name;
      }

      if (component.types.includes("country")) {
        data.country = component.short_name;
      }

      if (component.types.includes("postal_code")) {
        data.postal = component.long_name;
      }
    }

    setAddress(data.address);
    setCity(data.city);
    setState(data.state);
    setCountry(data.country);
    setPostal(data.postal);

    setShowAddressFull(true);

    setTimeout(() => {
      address2Ref.current && address2Ref.current.focus();
    }, 100);
  }

  function onCardNumberChange(value: string) {
    const raw = value.replace(/\D/g, ""); // Digits only
    const brand = getCardBrand(raw);

    // Set max length by brand
    let maxLength = 16;
    if (brand === "AMEX") {
      maxLength = 15;
    } else if (brand === "VISA") {
      maxLength = 19;
    }

    const trimmed = raw.slice(0, maxLength);

    let formatted = trimmed;

    if (brand === "AMEX") {
      // AMEX: 4-6-5 format
      formatted = trimmed.replace(
        /^(\d{0,4})(\d{0,6})(\d{0,5}).*/,
        (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join(" ")
      );
    } else {
      // Default: space every 4 digits
      formatted = trimmed.replace(/(.{1,4})/g, "$1 ").trim();
    }

    setCardNumber(formatted);
  }

  function onCardExpiryChange(value: string) {
    let digitsOnly = value.replace(/\D/g, "");

    // Auto-prepend 0 if user types a single-digit month like 3 → 03
    if (digitsOnly.length === 1 && parseInt(digitsOnly, 10) > 1) {
      digitsOnly = "0" + digitsOnly;
    }

    digitsOnly = digitsOnly.slice(0, 4); // MMYY

    let month = digitsOnly.slice(0, 2);
    let year = digitsOnly.slice(2);

    // Auto-correct invalid month
    if (month.length === 2) {
      let monthNum = parseInt(month, 10);
      if (monthNum < 1) monthNum = 1;
      if (monthNum > 12) monthNum = 12;
      month = monthNum < 10 ? "0" + monthNum : "" + monthNum;
    }

    // Auto-correct year if in past (assume 20YY)
    if (year.length === 2) {
      const currentYear = new Date().getFullYear() % 100; // last 2 digits
      const currentMonth = new Date().getMonth() + 1; // 1–12

      const yearNum = parseInt(year, 10);
      if (yearNum < currentYear) {
        year = currentYear.toString().padStart(2, "0");
        month = currentMonth.toString().padStart(2, "0");
      } else if (
        yearNum === currentYear &&
        parseInt(month, 10) < currentMonth
      ) {
        // If same year, make sure month isn't in past
        month = currentMonth.toString().padStart(2, "0");
      }
    }

    const formatted = year ? `${month}/${year}` : month;
    setCardExpiry(formatted);
  }

  return (
    <div className="px-4 pt-8">
      <Container className="">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <div>
              <h2 className="text-xl font-semibold">Contact</h2>

              <div className="mt-4">
                <InputGroup>
                  <Label htmlFor="email">Email</Label>

                  <Input
                    autoComplete="email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className="flex items-center gap-2 mt-1">
                    <Checkbox
                      id="subscribe"
                      checked={subscribe}
                      onChange={(e) => setSubscribe(e.target.checked)}
                    />

                    <label
                      className="text-sm leading-3.5 cursor-pointer select-none"
                      htmlFor="subscribe"
                    >
                      Email me with updates and offers
                    </label>
                  </div>
                </InputGroup>
              </div>
            </div>

            <hr className="my-8 border-zinc-100" />

            <div>
              <h2 className="text-xl font-semibold">Address</h2>

              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-2">
                  <InputGroup>
                    <Label htmlFor="first-name">First Name</Label>

                    <Input
                      autoComplete="given-name"
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label htmlFor="last-name">Last Name</Label>

                    <Input
                      autoComplete="family-name"
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </InputGroup>
                </div>

                <InputGroup>
                  <Label htmlFor="country">Country</Label>

                  <Select
                    autoComplete="country"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="us">United States</option>
                  </Select>
                </InputGroup>

                <InputGroup className="items-start w-full">
                  <Label htmlFor="address">Address</Label>

                  {isAddressManual ? (
                    <Input
                      autoComplete="street-address"
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  ) : (
                    <AddressAutocompleteInput
                      autoComplete="off"
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onPlaceSelected={onPlaceSelected}
                    />
                  )}

                  {!isAddressManual && !showAddressFull && (
                    <button
                      className="mt-0.5 text-left text-xs underline decoration-dotted cursor-pointer"
                      onClick={() => setIsAddressManual(true)}
                    >
                      Enter address manually
                    </button>
                  )}
                </InputGroup>

                {(isAddressManual || showAddressFull) && (
                  <>
                    <InputGroup>
                      <Label htmlFor="address-2">Address Line 2</Label>

                      <Input
                        autoComplete="address-line2"
                        id="address-2"
                        placeholder="Apt / Suite / Unit"
                        ref={address2Ref}
                        type="text"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                      />
                    </InputGroup>

                    <InputGroup>
                      <Label htmlFor="city">City</Label>

                      <Input
                        autoComplete="address-level2"
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </InputGroup>

                    <div className="flex gap-2">
                      <InputGroup>
                        <Label htmlFor="state">State</Label>

                        <Select
                          autoComplete="address-level1"
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          <option disabled value=""></option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="DC">District Of Columbia</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </Select>
                      </InputGroup>

                      <InputGroup>
                        <Label htmlFor="postal">Zip Code</Label>

                        <Input
                          autoComplete="postal-code"
                          id="postal"
                          type="text"
                          value={postal}
                          onChange={(e) => setPostal(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                  </>
                )}
              </div>
            </div>

            <hr className="my-8 border-zinc-100" />

            <div>
              <h2 className="text-xl font-semibold">Shipping Options</h2>

              <div className="flex flex-col gap-2 mt-4">
                {shippingOptions.map((shippingOption) => (
                  <ShippingMethod
                    key={shippingOption.id}
                    active={shippingOption.id === shippingId}
                    option={shippingOption}
                    total={cartSubtotal - cartDiscount}
                    onClick={() => setShippingId(shippingOption.id)}
                  />
                ))}
              </div>
            </div>

            <hr className="my-8 border-zinc-100" />

            <div>
              <h2 className="text-xl font-semibold">Payment</h2>

              <div className="flex flex-col gap-2 mt-4">
                <PaymentMethodContainer
                  active={paymentMethod === "credit-card"}
                >
                  <PaymentMethodButton
                    onClick={() => setPaymentMethod("credit-card")}
                  >
                    <Radio active={paymentMethod === "credit-card"} />

                    <p className="font-semibold">Credit Card</p>

                    <CardIcons brand={getCardBrand(cardNumber)} />
                  </PaymentMethodButton>

                  {paymentMethod === "credit-card" && (
                    <PaymentMethodContent>
                      <div className="flex flex-col gap-4 lg:flex-row lg:gap-2">
                        <InputGroup>
                          <Label htmlFor="card-number">Card Number</Label>

                          <Input
                            autoComplete="cc-number"
                            id="card-number"
                            type="text"
                            value={cardNumber}
                            onChange={(e) => onCardNumberChange(e.target.value)}
                          />
                        </InputGroup>

                        <div className="flex gap-2 w-full">
                          <InputGroup>
                            <Label htmlFor="card-expiration">Expiry</Label>

                            <Input
                              autoComplete="cc-exp"
                              id="card-expiration"
                              type="text"
                              placeholder="MM / YY"
                              value={cardExpiry}
                              onChange={(e) =>
                                onCardExpiryChange(e.target.value)
                              }
                            />
                          </InputGroup>

                          <InputGroup>
                            <Label htmlFor="card-cvc">Security Code</Label>

                            <Input
                              autoComplete="cc-csc"
                              id="card-cvc"
                              type="text"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                            />
                          </InputGroup>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                        <InputGroup>
                          <Label htmlFor="card-name">Name on Card</Label>

                          <Input
                            autoComplete="cc-name"
                            id="card-name"
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </InputGroup>

                        <InputGroup>
                          <Label htmlFor="card-postal">Billing Zip</Label>

                          <Input
                            autoComplete="billing postal-code"
                            id="card-postal"
                            type="text"
                            value={cardPostal}
                            onChange={(e) => setCardPostal(e.target.value)}
                          />
                        </InputGroup>
                      </div>
                    </PaymentMethodContent>
                  )}
                </PaymentMethodContainer>

                <ZellePaymentMethod
                  active={paymentMethod === "zelle"}
                  onSelect={() => setPaymentMethod("zelle")}
                >
                  <PaymentMethodContent className="items-center justify-center text-center">
                    <p className="text-sm">
                      Pay by sending{" "}
                      <strong>{format.currency(cartTotal)}</strong> to the Zelle
                      QR or number below
                    </p>

                    <ClientOnly>
                      {() => (
                        <QRCode
                          className="w-40 h-40"
                          value="https://example.com"
                        />
                      )}
                    </ClientOnly>

                    <p className="text-xl font-bold leading-5">
                      +1 (786) 566-3330
                    </p>

                    <p className="-mt-2 text-xs">
                      Please send the payment via Zelle, then click complete
                      checkout.
                    </p>
                  </PaymentMethodContent>
                </ZellePaymentMethod>
              </div>
            </div>

            <div className="hidden grid-cols-4 mt-4 md:grid">
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

          <div className="pt-8 border-t border-zinc-200 md:col-span-2 md:pt-0 md:border-t-0">
            <div className="flex flex-col border border-zinc-200 rounded-lg">
              {cart.items.map((cartItem) => (
                <div
                  className="flex gap-4 p-4 border-t border-zinc-200 first:border-t-0"
                  key={cartItem.id}
                >
                  <div className="min-w-16 w-16 h-16 p-2 bg-zinc-100 rounded">
                    <img
                      alt={cartItem.name}
                      className="w-full h-full object-contain"
                      src={cartItem.image.url}
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="flex items-start justify-between gap-4 w-full">
                      <p className="font-semibold leading-4">
                        {cartItem.quantity} x {cartItem.name}
                      </p>
                    </div>

                    <p className="mt-0.5 text-zinc-500 text-xs leading-3.5">
                      {cartItem.variants.map((variant, index) => (
                        <Fragment key={variant.variantId}>
                          <strong>{variant.name}:</strong> {variant.value}
                          {index !== cartItem.variants.length - 1 && ", "}
                        </Fragment>
                      ))}
                    </p>

                    <div className="flex items-end justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-red-500 font-semibold leading-3.5">
                          {format.currency(cartItem.price * cartItem.quantity)}
                        </p>

                        <p className="text-xs text-zinc-500 font-medium line-through leading-3">
                          {format.currency(
                            (cartItem.price / 80) * 100 * cartItem.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky top-4 mt-2">
              <div className="border border-zinc-200 rounded-lg">
                <div className="flex p-4">
                  <h2 className="text-xl font-semibold leading-5">
                    Order Summary
                  </h2>
                </div>

                <div className="flex flex-col p-4 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <p>Subtotal</p>
                    <p>{format.currency(cartSubtotal)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p>Discounts</p>
                    {cartDiscount > 0 ? (
                      <p className="text-red-600 font-medium">
                        -{format.currency(cartDiscount)}
                      </p>
                    ) : (
                      <p>$0.00</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p>Shipping</p>
                    <p>{format.currency(shippingTotal)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200 text-lg font-bold">
                    <p>Total</p>
                    <p>{format.currency(cartTotal)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <Button className="w-full">Complete Checkout</Button>

                <p className="mt-2 text-xs text-zinc-500 text-center leading-3.5">
                  By making a purchase, you agree to our{" "}
                  <Link className="underline" to="/legal/terms">
                    terms of service
                  </Link>
                  .
                </p>

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
        </div>
      </Container>
    </div>
  );
}

type ShippingMethodProps = React.ComponentProps<"button"> & {
  active?: boolean;
  option: (typeof shippingOptions)[number];
  total: number;
};

type CardIconsProps = {
  brand?: string | null;
};

type PaymentMethodProps = {
  active?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
};

type AddressAutocompleteInputProps = {
  onPlaceSelected: ReactGoogleAutocompleteProps["onPlaceSelected"];
} & InputProps;

function AddressAutocompleteInput({
  onPlaceSelected,
  ...props
}: AddressAutocompleteInputProps) {
  const { ref: addressRef } = usePlacesWidget<HTMLInputElement>({
    apiKey: "AIzaSyCAKJnuSa3PDUxJtb1qsoHH4zy7vUOGsCM",
    onPlaceSelected,
    options: {
      types: ["address"],
      componentRestrictions: {
        country: "us",
      },
    },
  });

  return (
    <div className="relative w-full">
      <Input className="pr-8" {...props} ref={addressRef} />

      <SearchIcon className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4" />
    </div>
  );
}

function ShippingMethod({
  active,
  option,
  total,
  ...props
}: ShippingMethodProps) {
  function getDeliveryEstimate(shippingDays: number) {
    // Get EST time
    let dateEstStr = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    // EST Date Object
    const date = new Date(dateEstStr);

    // If past 5 P.M. add 1 day to shipping date
    if (date.getHours() > 17) {
      shippingDays += 1;
    }

    const result = new Date();

    let shippingDaysAdded = 0;

    while (shippingDaysAdded < shippingDays) {
      result.setDate(result.getDate() + 1);

      const day = result.getDay();

      if (day !== 0) {
        shippingDaysAdded++;
      }
    }

    return result.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }

  return (
    <button
      className={cn(
        "flex gap-3 group p-4 border border-zinc-200 rounded ring-1 ring-transparent outline-none transition-colors text-left cursor-pointer",
        active ? "border-black ring-black" : "hover:border-zinc-400"
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center w-5 h-5 border border-zinc-200 rounded-full transition-colors",
          active ? "border-black" : "group-hover:border-zinc-400"
        )}
      >
        <div
          className={cn(
            "w-3 h-3 bg-transparent rounded-full transition-colors",
            active && "bg-black"
          )}
        ></div>
      </div>

      <div>
        <p className="font-semibold leading-4">{option.name}</p>

        <p className="mt-1 text-zinc-500 text-sm leading-3.5">
          Arrives on {getDeliveryEstimate(option.estimatedDays)}
        </p>
      </div>

      <p className="ml-auto font-semibold leading-4">
        {total >= option.freeThreshold ? "FREE" : format.currency(option.price)}
      </p>
    </button>
  );
}

function CardIcons({ brand }: CardIconsProps) {
  return (
    <PaymentMethodIcons>
      {brand === "AMEX" && <PaymentMethodIcon alt="Amex" src="/img/amex.svg" />}
      {brand === "VISA" && <PaymentMethodIcon alt="Visa" src="/img/visa.svg" />}
      {brand === "MASTERCARD" && (
        <PaymentMethodIcon alt="Mastercard" src="/img/mastercard.svg" />
      )}
      {brand === "DISCOVER" && (
        <PaymentMethodIcon alt="Discover" src="/img/discover.svg" />
      )}
      {!brand && (
        <>
          <PaymentMethodIcon alt="Visa" src="/img/visa.svg" />
          <PaymentMethodIcon alt="Mastercard" src="/img/mastercard.svg" />

          <p className="ml-1 text-xs text-zinc-500 font-medium leading-3">
            + 2 <br />
            More
          </p>
        </>
      )}
    </PaymentMethodIcons>
  );
}

function ZellePaymentMethod({
  children,
  active,
  onSelect,
}: PaymentMethodProps) {
  return (
    <PaymentMethodContainer active={active}>
      <PaymentMethodButton onClick={() => onSelect && onSelect()}>
        <Radio active={active} />

        <p className="font-semibold">Zelle</p>

        <PaymentMethodIcons>
          <PaymentMethodIcon alt="Zelle" src="/img/zelle.svg" />
        </PaymentMethodIcons>
      </PaymentMethodButton>

      {active && children}
    </PaymentMethodContainer>
  );
}
