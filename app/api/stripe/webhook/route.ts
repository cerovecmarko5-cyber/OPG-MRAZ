export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getSupabase } from "../../../../lib/supabase";

const RECIPIENT = "opgmiromraz1904@gmail.com";

type ParsedItem = { name: string; qty: number; price: number };

const formatItemsText = (items: ParsedItem[]) =>
  items.map((i) => `- ${i.name} x ${i.qty} = ${(i.price * i.qty).toFixed(2)} EUR`).join("\n");

const formatItemsHtml = (items: ParsedItem[]) =>
  items
    .map(
      (i) =>
        `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0">${i.name}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center">${i.qty}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:right">${(i.price * i.qty).toFixed(2)} EUR</td></tr>`
    )
    .join("");

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Nedostaje potpis" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook greška:", err);
    return NextResponse.json({ error: "Neispravan webhook" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    const customerName = meta.customerName || "";
    const customerEmail = session.customer_email || "";
    const customerPhone = meta.customerPhone || "";
    const customerAddress = meta.customerAddress || "";
    const deliveryName = meta.deliveryName || "";
    const total = (session.amount_total || 0) / 100;

    let items: ParsedItem[] = [];
    try {
      items = JSON.parse(meta.items || "[]");
    } catch {
      items = [];
    }

    // Spremi narudžbu u Supabase
    const supabase = getSupabase();
    await supabase.from("orders").insert({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: customerAddress,
      items: items,
      total,
      payment_method: "card",
      delivery: deliveryName,
      stripe_session_id: session.id,
    });

    // Pošalji emailove
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const itemRowsHtml = formatItemsHtml(items);
      const firstName = customerName.split(" ")[0];

      const ownerHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#b91c1c">✅ Nova PLAĆENA narudžba (kartica)</h2>
        <p><b>Ime:</b> ${customerName}</p>
        <p><b>Email:</b> ${customerEmail}</p>
        <p><b>Telefon:</b> ${customerPhone}</p>
        <p><b>Adresa:</b> ${customerAddress}</p>
        <p><b>Dostava:</b> ${deliveryName}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr style="background:#f1f5f9">
            <th style="padding:6px 10px;border:1px solid #e2e8f0;text-align:left">Proizvod</th>
            <th style="padding:6px 10px;border:1px solid #e2e8f0">Količina</th>
            <th style="padding:6px 10px;border:1px solid #e2e8f0;text-align:right">Cijena</th>
          </tr>
          ${itemRowsHtml}
        </table>
        <p style="margin-top:16px;font-size:18px"><b>Ukupno: ${total.toFixed(2)} EUR</b></p>
        <p style="color:#16a34a;font-weight:bold">💳 Plaćanje karticom je uspješno!</p>
      </div>`;

      const customerHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#b91c1c;padding:24px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">OPG Mraz</h1>
        </div>
        <div style="padding:24px">
          <h2 style="color:#1e293b">Hvala na narudžbi, ${firstName}!</h2>
          <p style="color:#475569">Vaša narudžba je <b>plaćena i potvrđena</b>. Miro će Vam poslati robu u najkraćem mogućem roku.</p>
          <p><b>Odabrana dostava:</b> ${deliveryName}</p>
          <h3 style="color:#1e293b;margin-top:24px">Detalji narudžbe:</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f1f5f9">
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:left">Proizvod</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0">Količina</th>
              <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">Cijena</th>
            </tr>
            ${itemRowsHtml}
          </table>
          <p style="margin-top:16px;font-size:18px;color:#1e293b"><b>Ukupno: ${total.toFixed(2)} EUR</b></p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-top:24px">
            <p style="margin:0;color:#166534">✅ Plaćanje karticom je uspješno potvrđeno.</p>
          </div>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:16px">
            <p style="margin:0;color:#991b1b">📞 Za pitanja: <b>+385 98 188 6119</b></p>
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px;text-align:center;color:#94a3b8;font-size:12px">
          <p style="margin:0">OPG Mraz | Domaći prirodni proizvodi</p>
        </div>
      </div>`;

      await resend.emails.send({
        from: "OPG Mraz <narudzbe@opg-mrazmiro.com>",
        to: [RECIPIENT],
        replyTo: customerEmail,
        subject: `✅ Nova PLAĆENA narudžba od ${customerName} - ${total.toFixed(2)} EUR`,
        html: ownerHtml,
        text: `Nova plaćena narudžba\n\nIme: ${customerName}\nEmail: ${customerEmail}\nTelefon: ${customerPhone}\nAdresa: ${customerAddress}\nDostava: ${deliveryName}\n\n${formatItemsText(items)}\n\nUkupno: ${total.toFixed(2)} EUR`,
      });

      await resend.emails.send({
        from: "OPG Mraz <narudzbe@opg-mrazmiro.com>",
        to: [customerEmail],
        replyTo: RECIPIENT,
        subject: `Potvrda narudžbe - OPG Mraz`,
        html: customerHtml,
        text: `Hvala na narudžbi, ${firstName}!\n\nVaša narudžba je plaćena i potvrđena.\nDostava: ${deliveryName}\n\n${formatItemsText(items)}\n\nUkupno: ${total.toFixed(2)} EUR\n\nZa pitanja: +385 98 188 6119`,
      });
    }
  }

  return NextResponse.json({ received: true });
}
