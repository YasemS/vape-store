import { useState } from "react";
import { data, Form, redirect } from "react-router";
import { AlertCircleIcon, MoveRightIcon } from "lucide-react";

import Button from "~/components/Button";
import Container from "~/components/Container";
import Input from "~/components/Input";
import InputGroup from "~/components/InputGroup";
import Label from "~/components/Label";

import prisma from "~/lib/prisma.server";

import type { Route } from "./+types/track";

export const meta: Route.MetaFunction = () => [
  {
    title: "Track Your Order - AYVapes",
  },
];

export async function action({ request }: Route.LoaderArgs) {
  const formData = await request.formData();

  const orderId = formData.get("order-id");

  if (!orderId || typeof orderId !== "string") {
    return data({ error: "Order ID is required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    select: { id: true },
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return data({ error: "Order not found" });
  }

  return redirect(`/order/${order.id.toUpperCase()}`);
}

export default function Track({ actionData }: Route.ComponentProps) {
  const [orderId, setOrderId] = useState("");

  function onOrderIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOrderId(e.target.value.toUpperCase());
  }

  return (
    <div className="px-4 py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Track Your Order</h1>

          <p className="mt-1 text-zinc-700">
            Enter your order number below to track your shipment.
          </p>

          <Form className="flex flex-col gap-2 mt-8" method="post">
            {actionData && "error" in actionData && (
              <div className="flex gap-2 mb-4 text-red-500">
                <AlertCircleIcon className="w-4 h-4" />

                <p className="text-sm leading-4">{actionData.error}</p>
              </div>
            )}

            <InputGroup>
              <Label>Order Number</Label>
              <Input
                type="text"
                name="order-id"
                value={orderId}
                onChange={onOrderIdChange}
              />
            </InputGroup>

            <Button type="submit">
              <span>Track Order</span>
              <MoveRightIcon className="w-6 h-6 ml-1" />
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}
