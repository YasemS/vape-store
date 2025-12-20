import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const template = {
  order: {
    confirmation: (opts: TemplateEmailConfirmationOptions) => {
      return {
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>order confirmation - puffly</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        color: #000;
        padding: 8px;
        line-height: 1.6;
      }

      a {
        color: #2563eb;
        text-decoration: underline;
      }

      .footer p {
        margin: 0;

        line-height: 1.2;

        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <p>hi ${opts.name},</p>

    <p>thank you for your order! it's currently being processed and is scheduled to ship within 1-2 business days.</p>

    <p>
      order id: ${opts.id}
      <br />
      address: ${opts.address}
      <br />
      link: <a href="https://www.puffly.io/order/${
        opts.id
      }" target="_blank">view order</a>
      <br />
      items:
      <br />
      <ul>
        ${opts.items.map((item) => `<li>${item}</li>`).join(" ")}
      </ul>
    </p>

    <p>
      if you have any questions or need help, reply to this email.
    </p>

    <p>thanks again for your order, we'll update you once it's officially on the move!</p>

    <div class="footer">
      <p>puffly</p>

      <div>
        <a href="https://www.puffly.io" target="_blank">www.puffly.io</a>
        <span>•</span>
        <a href="mailto:support@puffly.io" target="_blank">support@puffly.io</a>
      </div>
    </div>
  </body>
</html>`,
        text: `hi ${opts.name},
    
thank you for your order! it's currently being processed and is scheduled to ship within 1-2 business days.

order id: ${opts.id}
address: ${opts.address}
link: https://www.puffly.io/order/${opts.id}

items:
${opts.items.map((item) => `- ${item}`).join("\n")}

if you have any questions or need help, reply to this email.

thanks again for your order, we'll update you once it's officially on the move!`,
      };
    },
    pending: (opts: TemplateEmailPendingOptions) => {
      return {
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Pending - AYVapes</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        color: #000;
        padding: 8px;
        line-height: 1.6;
      }

      a {
        color: #2563eb;
        text-decoration: underline;
      }

      .footer p {
        margin: 0;

        line-height: 1.2;

        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <p>Hi ${opts.name},</p>

    <p>We've received your order, it will be processed once we have received your payment via ${
      opts.payment
    }.</p>

    <p>
      Order ID: ${opts.id}
      <br />
      Address: ${opts.address}
      <br />
      Link: <a href="https://www.ayvapes.com/order/${
        opts.id
      }" target="_blank">View order</a>
      <br />
      Items:
      <br />
      <ul>
        ${opts.items.map((item) => `<li>${item}</li>`).join(" ")}
      </ul>
    </p>

    <p>
      If you have any questions or need help, reply to this email.
    </p>

    <div class="footer">
      <p>AYVapes</p>

      <div>
        <a href="https://www.ayvapes.com" target="_blank">www.ayvapes.com</a>
        <span>•</span>
        <a href="mailto:support@ayvapes.com" target="_blank">support@ayvapes.com</a>
      </div>
    </div>
  </body>
</html>`,
        text: `Hi ${opts.name},

We've received your order, it will be processed once we have received your payment via ${
          opts.payment
        }.

Order ID: ${opts.id}
Address: ${opts.address}
Link: https://www.ayvapes.com/order/${opts.id}

Items:
${opts.items.map((item) => `- ${item}`).join("\n")}

If you have any questions or need help, reply to this email.`,
      };
    },
  },
};

type TemplateEmailConfirmationOptions = {
  id: string;
  name: string;
  address: string;
  items: string[];
};

type TemplateEmailPendingOptions = {
  id: string;
  name: string;
  address: string;
  items: string[];
  payment: string;
};
