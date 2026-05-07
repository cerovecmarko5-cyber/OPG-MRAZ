export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT = "opgmiromraz1904@gmail.com";

type OrderItem = { product: { name: string; price: number }; quantity: number };
type Payload = { name: string; email: string; phone: string; address: string; items: OrderItem[]; total: number };

const formatItems = (items: OrderItem[]) =>
  items.map((i) => `- ${i.product.name} x ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} EUR`).join("\n");

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev" }, { status: 400 });
  }

  const { name, email, phone, address, items, total } = payload;

  if (!name || !email || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Nedostaju obavezna polja" }, { status: 400 });
  }

  const subject = `Nova naruzba od ${name} - ${total.toFixed(2)} EUR`;
  const itemRows = items.map((i) => `<tr><td>${i.product.name}</td><td>${i.quantity}</td><td>${(i.product.price * i.quantity).toFixed(2)} EUR</td></tr>`).join("");
  const html = `<h2>Nova naruzba</h2><p><b>Ime:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Telefon:</b> ${phone}</p><p><b>Adresa:</b> ${address}</p><table border="1" cellpadding="6"><tr><th>Proizvod</th><th>Kolicina</th><th>Cijena</th></tr>${itemRows}</table><p><b>Ukupno: ${total.toFixed(2)} EUR</b></p>`;
  const text = `Nova naruzba\n\nIme: ${name}\nEmail: ${email}\nTelefon: ${phone}\nAdresa: ${address}\n\nProizvodi:\n${formatItems(items)}\n\nUkupno: ${total.toFixed(2)} EUR`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY nije postavljen");
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "OPG Mraz <onboarding@resend.dev>",
      to: [RECIPIENT],
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
    } else {
      console.log("Email poslan:", data?.id);
    }
  } catch (err) {
    console.error("Resend exception:", err);
  }

  return NextResponse.json({ success: true });
}
