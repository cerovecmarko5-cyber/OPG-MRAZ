export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const RECIPIENT = 'opgmiromraz1904@gmail.com';

type OrderItem = { product: { name: string; price: number }; quantity: number };
type Payload = { name: string; email: string; phone: string; address: string; items: OrderItem[]; total: number };

const formatItems = (items: OrderItem[]) =>
  items.map((i) => `- ${i.product.name} x ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} EUR`).join('\n');

const buildText = (p: Payload) =>
  `Nova naruzba\n\nIme: ${p.name}\nEmail: ${p.email}\nTelefon: ${p.phone}\nAdresa: ${p.address}\n\nProizvodi:\n${formatItems(p.items)}\n\nUkupno: ${p.total.toFixed(2)} EUR`;

const buildHtml = (p: Payload) =>
  `<h2>Nova naruzba</h2><p><b>Ime:</b> ${p.name}</p><p><b>Email:</b> ${p.email}</p><p><b>Telefon:</b> ${p.phone}</p><p><b>Adresa:</b> ${p.address}</p><h3>Proizvodi</h3><ul>${p.items.map((i) => `<li>${i.product.name} x ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} EUR</li>`).join('')}</ul><p><b>Ukupno:</b> ${p.total.toFixed(2)} EUR</p>`;

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev' }, { status: 400 });
  }

  const { name, email, phone, address, items, total } = payload;

  if (!name || !email || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 });
  }

  const subject = `Nova naruzba od ${name}`;
  const text = buildText(payload);
  const html = buildHtml(payload);

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
      });
      await transporter.sendMail({
        from: `OPG i DESTILERIJA Mraz <${smtpUser}>`,
        to: RECIPIENT,
        replyTo: email,
        subject,
        text,
        html,
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('SMTP failed:', err);
    }
  }

  try {
    const formBody = new URLSearchParams();
    formBody.append('name', name);
    formBody.append('email', email);
    formBody.append('phone', phone);
    formBody.append('address', address);
    formBody.append('items', formatItems(items));
    formBody.append('total', `${total.toFixed(2)} EUR`);
    formBody.append('_subject', subject);
    formBody.append('_captcha', 'false');

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: formBody.toString(),
    });
    if (res.ok) return NextResponse.json({ success: true });
    console.error('FormSubmit failed:', await res.text());
  } catch (err) {
    console.error('FormSubmit error:', err);
  }

  return NextResponse.json({ success: true });
}
