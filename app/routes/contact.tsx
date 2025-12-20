import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import Container from "~/components/Container";

import type { Route } from "./+types/contact";

export const meta: Route.MetaFunction = () => [
  {
    title: "Contact - AYVapes",
  },
];

export default function Contact() {
  return (
    <div className="px-4 py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Contact Us</h1>

          <h2 className="mt-4 text-xl font-medium">FAQ</h2>

          <FAQ />

          <h2 className="mt-8 text-xl font-medium">Other</h2>

          <p className="mt-1 text-sm">
            For any other inquiries, please email us at:{" "}
            <a
              className="underline font-medium hover:no-underline"
              href="mailto:support@ayvapes.com"
            >
              support@ayvapes.com
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}

function FAQ() {
  const items = [
    {
      question: "Do you offer discreet shipping?",
      answer:
        "Yes, every order is shipped using discreet, non-branded packaging. The package will not display our name, logo, or any details about the contents, so your order remains completely private during shipping and delivery.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "No, we currently ship exclusively within the United States. Unfortunately, we do not offer international or overseas shipping at this time, but this may change in the future.",
    },
    {
      question: "How long does it take to ship an order?",
      answer:
        "Orders are typically processed and shipped within 1-2 business days. Shipping times may vary depending on the carrier and destination but orders usually arrive within 2-7 business days.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 14-day return policy for any unopened (sealed) products within 14 days of purchase, please see our full return policy for more details.",
    },
  ];

  const [faqOpen, setFaqOpen] = useState<string[]>([]);

  function onFaqClick(id: string) {
    setFaqOpen((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }

  return (
    <div className="flex flex-col mt-2 border border-zinc-200 rounded-lg">
      {items.map((item) => (
        <div className="border-t border-zinc-200 first:border-t-0">
          <button
            onClick={() => onFaqClick(item.question)}
            className="flex items-center justify-between w-full p-4 cursor-pointer"
          >
            <p className="font-medium">{item.question}</p>

            {faqOpen.includes(item.question) ? (
              <MinusIcon className="w-4 h-4" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
          </button>

          {faqOpen.includes(item.question) && (
            <div className="p-4 border-t border-zinc-200 text-sm">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
