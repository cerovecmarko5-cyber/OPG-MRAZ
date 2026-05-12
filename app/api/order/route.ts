export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { put, list } from '@vercel/blob';

async function readOrders() {
  try {
    const { blobs } = await list({ prefix: 'orders/orders.json' });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}

async function saveOrder(order: object) {
  try {
    const orders = await readOrders();
    (orders as object[]).unshift(order);
    await put('orders/orders.json', JSON.stringify(orders), {
      access: 'public', contentType: 'application/json', allowOverwrite: true,
    });
  } catch (e) {
    console.error('Greška pri spremanju narudžbe:', e);
  }
}

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

  // Spremi narudžbu u blob storage
  await saveOrder({ id: crypto.randomUUID(), name, email, phone, address, items, total, created_at: new Date().toISOString() });

  // Email za OPG vlasnika
  const ownerSubject = `Nova narudžba od ${name} - ${total.toFixed(2)} EUR`;
  const itemRowsHtml = items.map((i) => `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0">${i.product.name}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center">${i.quantity}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:right">${(i.product.price * i.quantity).toFixed(2)} EUR</td></tr>`).join("");
  const ownerHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#b91c1c">Nova narudžba</h2><p><b>Ime:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Telefon:</b> ${phone}</p><p><b>Adresa:</b> ${address}</p><table style="width:100%;border-collapse:collapse;margin-top:16px"><tr style="background:#f1f5f9"><th style="padding:6px 10px;border:1px solid #e2e8f0;text-align:left">Proizvod</th><th style="padding:6px 10px;border:1px solid #e2e8f0">Količina</th><th style="padding:6px 10px;border:1px solid #e2e8f0;text-align:right">Cijena</th></tr>${itemRowsHtml}</table><p style="margin-top:16px;font-size:18px"><b>Ukupno: ${total.toFixed(2)} EUR</b></p></div>`;
  const ownerText = `Nova narudžba\n\nIme: ${name}\nEmail: ${email}\nTelefon: ${phone}\nAdresa: ${address}\n\nProizvodi:\n${formatItems(items)}\n\nUkupno: ${total.toFixed(2)} EUR`;

  // Email za kupca (potvrda narudžbe)
  const firstName = name.split(" ")[0];
  const customerSubject = `Potvrda narudžbe - OPG Mraz`;
  const customerHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#b91c1c;padding:24px;text-align:center"><h1 style="color:white;margin:0;font-size:24px">OPG Mraz</h1></div><div style="padding:24px"><h2 style="color:#1e293b">Hvala na narudžbi, ${firstName}!</h2><p style="color:#475569">Vaša narudžba je primljena. Miro će Vas uskoro kontaktirati radi dogovora o dostavi i plaćanju.</p><h3 style="color:#1e293b;margin-top:24px">Detalji narudžbe:</h3><table style="width:100%;border-collapse:collapse"><tr style="background:#f1f5f9"><th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:left">Proizvod</th><th style="padding:8px 12px;border:1px solid #e2e8f0">Količina</th><th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">Cijena</th></tr>${itemRowsHtml}</table><p style="margin-top:16px;font-size:18px;color:#1e293b"><b>Ukupno: ${total.toFixed(2)} EUR</b></p><div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:24px"><p style="margin:0;color:#991b1b">📞 Za pitanja nas možete kontaktirati na <b>+385 98 188 6119</b></p></div></div><div style="background:#f8fafc;padding:16px;text-align:center;color:#94a3b8;font-size:12px"><p style="margin:0">OPG Mraz | Domaći prirodni proizvodi</p></div></div>`;
  const customerText = `Hvala na narudžbi, ${firstName}!\n\nVaša narudžba je primljena. Miro će Vas uskoro kontaktirati radi dogovora o dostavi i plaćanju.\n\nDetalji narudžbe:\n${formatItems(items)}\n\nUkupno: ${total.toFixed(2)} EUR\n\nZa pitanja: +385 98 188 6119\nOPG Mraz`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY nije postavljen");
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);

  try {
    // Pošalji email vlasniku
    const { error: ownerError } = await resend.emails.send({
      from: "OPG Mraz <narudzbe@opg-mrazmiro.com>",
      to: [RECIPIENT],
      replyTo: email,
      subject: ownerSubject,
      html: ownerHtml,
      text: ownerText,
    });
    if (ownerError) console.error("Resend owner error:", ownerError);

    // Pošalji potvrdu kupcu
    const { error: customerError } = await resend.emails.send({
      from: "OPG Mraz <narudzbe@opg-mrazmiro.com>",
      to: [email],
      replyTo: RECIPIENT,
      subject: customerSubject,
      html: customerHtml,
      text: customerText,
    });
    if (customerError) console.error("Resend customer error:", customerError);
  } catch (err) {
    console.error("Resend exception:", err);
  }

  return NextResponse.json({ success: true });
}
