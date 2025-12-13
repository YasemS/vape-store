import { Link, type LinkProps } from "react-router";

import Container from "~/components/Container";

type FooterLinkProps = LinkProps;

function FooterLink({ to, children }: FooterLinkProps) {
  return (
    <Link
      className="mt-4 transition text-sm leading-4 underline decoration-transparent hover:decoration-black"
      to={to}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 px-4 py-8 mt-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="flex flex-col items-start pb-8 border-b border-zinc-200 md:col-span-2 md:pb-0 md:border-b-0">
            <Link className="text-3xl font-black" to="/">
              AY<span className="text-orange-500">VAPES</span>
            </Link>

            <p className="max-w-md mt-1 text-sm leading-4.5">
              Your go-to source for top-tier vapes, unbeatable flavor, and
              premium quality.
            </p>
          </div>

          <div className="flex flex-col items-start py-8 border-b border-zinc-200 md:py-0 md:border-b-0">
            <p className="text-lg font-bold leading-4.5">Links</p>

            <FooterLink to="/products">Products</FooterLink>

            <FooterLink to="/track">Track Your Order</FooterLink>

            <FooterLink to="/contact">Contact Us</FooterLink>

            <FooterLink to="/sitemap.xml">Sitemap</FooterLink>
          </div>

          <div className="flex flex-col items-start pt-8 md:pt-0">
            <p className="text-lg font-bold leading-4.5">Legal</p>

            <FooterLink to="/legal/privacy">Privacy Policy</FooterLink>

            <FooterLink to="/legal/terms">Return Policy</FooterLink>

            <FooterLink to="/legal/terms">Shipping Policy</FooterLink>

            <FooterLink to="/legal/terms">Terms of Service</FooterLink>
          </div>
        </div>

        <div className="mt-8 py-4 border-y border-zinc-200">
          <p className="text-sm leading-4.5">
            <strong>Disclaimer:</strong> Products on this site are not approved
            by the FDA and are not intended to diagnose, treat, cure, or prevent
            any disease. Nicotine is an addictive chemical. For adults 21+ only.
          </p>

          <div className="flex items-center gap-1 mt-2">
            <img alt="American Express" className="h-6" src="/img/amex.svg" />
            <img alt="Diners Club" className="h-6" src="/img/diners.svg" />
            <img alt="Discover" className="h-6" src="/img/discover.svg" />
            <img alt="Mastercard" className="h-6" src="/img/mastercard.svg" />
            <img alt="Visa" className="h-6" src="/img/visa.svg" />
            <img alt="Cash App" className="h-6" src="/img/cash-app.svg" />
            <img alt="Venmo" className="h-2 mx-0.5" src="/img/venmo.svg" />
            <img alt="Zelle" className="h-6" src="/img/zelle.svg" />
          </div>
        </div>

        <div className="flex items-center justify-center mt-4 text-xs">
          <p>&copy; {new Date().getFullYear()} AYVAPES. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
