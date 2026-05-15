export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";

export const DELIVERY_OPTIONS = [
  { id: "gls", name: "GLS dostava (2-3 radna dana)", price: 4.0 },
  { id: "hp", name: "Hrvatska pošta (3-5 radnih dana)", price: 3.5 },
  { id: "osobno", name: "Osobno preuzimanje (Zagorje)", price: 0 },
];

type CartItem = {
  product: { id: string; name: string; price: number };
  quantity: number;
};

type Payload = {
  items: CartItem[];
  deliveryId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
};

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev" }, { status: 400 });
  }

  const { items, deliveryId, customerName, customerEmail, customerPhone, customerAddress } = payload;

  if (!items?.length || !deliveryId || !customerName || !customerEmail || !customerPhone || !customerAddress) {
    return NextResponse.json({ error: "Nedostaju obavezna polja" }, { status: 400 });
  }

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId);
  if (!delivery) {
    return NextResponse.json({ error: "Neispravna opcija dostave" }, { status: 400 });
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  if (delivery.price > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: `Dostava: ${delivery.name}`,
        },
        unit_amount: Math.round(delivery.price * 100),
      },
      quantity: 1,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opg-mrazmiro.com";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${baseUrl}/checkout/uspjeh?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
    customer_email: customerEmail,
    metadata: {
      customerName,
      customerPhone,
      customerAddress,
      deliveryId,
      deliveryName: delivery.name,
      items: JSON.stringify(items.map((i) => ({ name: i.product.name, qty: i.quantity, price: i.product.price }))),
    },
    locale: "hr",
  });

  return NextResponse.json({ url: session.url });
}
