import { catalog } from "@/app/data/catalog";

type CheckoutLine = {
  id?: string;
  quantity?: number;
};

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return Response.json(
      {
        configured: false,
        message:
          "Stripe non è ancora configurato. Aggiungi STRIPE_SECRET_KEY alle variabili protette.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { items?: CheckoutLine[] };
  const lines = (body.items || [])
    .map((line) => {
      const product = catalog.find((item) => item.id === line.id);
      const quantity = Math.max(1, Math.min(20, Number(line.quantity) || 1));
      return product && product.inStock ? { product, quantity } : null;
    })
    .filter(Boolean) as Array<{
    product: (typeof catalog)[number];
    quantity: number;
  }>;

  if (!lines.length) {
    return Response.json(
      { configured: true, message: "Il carrello non contiene prodotti validi." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", `${origin}/?ordine=confermato`);
  form.set("cancel_url", `${origin}/?ordine=annullato`);
  form.set("shipping_address_collection[allowed_countries][0]", "IT");
  form.set("phone_number_collection[enabled]", "true");

  lines.forEach(({ product, quantity }, index) => {
    form.set(`line_items[${index}][quantity]`, String(quantity));
    form.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(Math.round(product.price * 100)),
    );
    form.set(`line_items[${index}][price_data][currency]`, "eur");
    form.set(
      `line_items[${index}][price_data][product_data][name]`,
      product.name,
    );
    if (product.image) {
      form.set(
        `line_items[${index}][price_data][product_data][images][0]`,
        product.image,
      );
    }
  });

  if (
    lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0,
    ) < 39.9
  ) {
    form.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    form.set(
      "shipping_options[0][shipping_rate_data][fixed_amount][amount]",
      "550",
    );
    form.set(
      "shipping_options[0][shipping_rate_data][fixed_amount][currency]",
      "eur",
    );
    form.set(
      "shipping_options[0][shipping_rate_data][display_name]",
      "Spedizione standard",
    );
  }

  const stripeResponse = await fetch(
    "https://api.stripe.com/v1/checkout/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    },
  );

  const session = (await stripeResponse.json()) as {
    url?: string;
    error?: { message?: string };
  };

  if (!stripeResponse.ok || !session.url) {
    return Response.json(
      {
        configured: true,
        message:
          session.error?.message ||
          "Stripe non ha potuto creare la sessione di pagamento.",
      },
      { status: 502 },
    );
  }

  return Response.json({ configured: true, url: session.url });
}

