type DataFastPaymentOpts = {
  orderId: string;
  email: string;
  name: string;
  total: number;
  datafastVisitorId: string;
  datafastApiKey: string;
};

async function payment(opts: DataFastPaymentOpts) {
  await fetch("https://datafa.st/api/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.datafastApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_id: opts.orderId,
      datafast_visitor_id: opts.datafastVisitorId,

      email: opts.email,
      name: opts.name,

      currency: "USD",
      amount: opts.total,
    }),
  });
}

export default {
  payment,
};
