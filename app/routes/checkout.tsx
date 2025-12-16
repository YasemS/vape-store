import {
  CreditCardIcon,
  LockIcon,
  PackageOpenIcon,
  SearchIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  usePlacesWidget,
  type ReactGoogleAutocompleteProps,
} from "react-google-autocomplete";

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
import { ClientOnly } from "remix-utils/client-only";
import QRCode from "react-qr-code";

type ShippingOption = {
  id: string;
  name: string;
  price: number;
  freeThreshold: number;
  estimatedDays: number;
};

export default function Checkout() {
  const shippingOptions: ShippingOption[] = [
    {
      id: "12345",
      name: "Standard Shipping",
      price: 3.99,
      freeThreshold: 50,
      estimatedDays: 5,
    },
    {
      id: "45678",
      name: "Express Shipping",
      price: 9.99,
      freeThreshold: 50,
      estimatedDays: 2,
    },
  ];

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

  const [shippingId, setShippingId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [isAddressManual, setIsAddressManual] = useState(false);
  const [showAddressFull, setShowAddressFull] = useState(false);

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
                    onClick={() => setShippingId(shippingOption.id)}
                  />
                ))}
              </div>
            </div>

            <hr className="my-8 border-zinc-100" />

            <div>
              <h2 className="text-xl font-semibold">Payment</h2>

              <div className="flex flex-col gap-2 mt-4">
                <CardPaymentMethod
                  active={paymentMethod === "credit-card"}
                  onSelect={() => setPaymentMethod("credit-card")}
                >
                  <PaymentMethodContent>
                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-2">
                      <InputGroup>
                        <Label htmlFor="card-number">Card Number</Label>

                        <Input
                          autoComplete="cc-number"
                          id="card-number"
                          type="text"
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
                          />
                        </InputGroup>

                        <InputGroup>
                          <Label htmlFor="card-cvc">Security Code</Label>

                          <Input
                            autoComplete="cc-csc"
                            id="card-cvc"
                            type="text"
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
                        />
                      </InputGroup>

                      <InputGroup>
                        <Label htmlFor="card-postal">Billing Zip</Label>

                        <Input
                          autoComplete="billing postal-code"
                          id="card-postal"
                          type="text"
                        />
                      </InputGroup>
                    </div>
                  </PaymentMethodContent>
                </CardPaymentMethod>

                <ZellePaymentMethod
                  active={paymentMethod === "zelle"}
                  onSelect={() => setPaymentMethod("zelle")}
                >
                  <PaymentMethodContent className="items-center justify-center text-center">
                    <p className="text-sm">
                      Pay by sending <strong>$8.39</strong> to the Zelle QR or
                      number below
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
              <div className="flex gap-4 p-4 border-t border-zinc-200 first:border-t-0">
                <div className="min-w-16 w-16 h-16 p-2 bg-zinc-100 rounded">
                  <img
                    className="w-full h-full object-contain"
                    src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between gap-4 w-full">
                    <p className="font-semibold leading-4">Geek Bar Pulse X</p>
                  </div>

                  <p className="mt-0.5 text-zinc-500 text-xs leading-3.5">
                    <strong>Flavour:</strong> Blue Razz Ice
                  </p>

                  <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-red-500 font-semibold leading-3.5">
                        $34.99
                      </p>

                      <p className="text-xs text-zinc-500 font-medium line-through">
                        $49.99
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 p-4 border-t border-zinc-200 first:border-t-0">
                <div className="min-w-16 w-16 h-16 p-2 bg-zinc-100 rounded">
                  <img
                    className="w-full h-full object-contain"
                    src="https://www.puffly.io/cdn-cgi/image/f=webp,q=90,h=450,w=450/https%3A%2F%2Fcdn.puffly.io%2Fimg%2Fproducts%2Fgeek-bar-pulse-x%2Fblue-razz-ice.png"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex items-start justify-between gap-4 w-full">
                    <p className="font-semibold leading-4">Geek Bar Pulse X</p>
                  </div>

                  <p className="mt-0.5 text-zinc-500 text-xs leading-3.5">
                    <strong>Flavour:</strong> Blue Razz Ice
                  </p>

                  <div className="flex items-end justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-red-500 font-semibold leading-3.5">
                        $34.99
                      </p>

                      <p className="text-xs text-zinc-500 font-medium line-through">
                        $49.99
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
  option: ShippingOption;
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

function ShippingMethod({ active, option, ...props }: ShippingMethodProps) {
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
        {format.currency(option.price)}
      </p>
    </button>
  );
}

function CardPaymentMethod({ children, active, onSelect }: PaymentMethodProps) {
  return (
    <PaymentMethodContainer active={active}>
      <PaymentMethodButton onClick={() => onSelect && onSelect()}>
        <Radio active={active} />

        <p className="font-semibold">Credit Card</p>

        <PaymentMethodIcons>
          <PaymentMethodIcon alt="Visa" src="/img/visa.svg" />
          <PaymentMethodIcon alt="Mastercard" src="/img/mastercard.svg" />
          <p className="ml-1 text-xs text-zinc-500 font-medium leading-3">
            + 2 <br />
            More
          </p>
        </PaymentMethodIcons>
      </PaymentMethodButton>

      {active && children}
    </PaymentMethodContainer>
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
