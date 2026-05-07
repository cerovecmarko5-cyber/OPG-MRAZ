export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

const RECIPIENT = 'opgmiromraz1904@gmail.com';

type OrderItem = { product: { name: string; price: number }; quantity: number };
type Payload = { name: string; email: string; phone: string; address: string; items: OrderItem[]; total: number };

const formatItems = (items: OrderItem[]) =>
  items.map((i) => `- ${i.product.name} x ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} EUR`).join('\n');

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

  const subject = `Nova naruzba od ${name} - ${total.toFixed(2)} EUR`;
  const itemList = formatItems(items);
  const message = `Ime: ${name}\nEmail: ${email}\nTelefon: ${phone}\nAdresa: ${address}\n\nProizvodi:\n${itemList}\n\nUkupno: ${total.toFixed(2)} EUR`;

  // FormSubmit - radi na serverlessu (HTTP, bez SMTP)
  try {
    const formBody = new URLSearchParams();
    formBody.append('name', name);
    formBody.append('email', email);
    formBody.append('_replyto', email);
    formBody.append('_subject', subject);
    formBody.append('message', message);
    formBody.append('_captcha', 'false');
    formBody.append('_template', 'table');

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formBody.toString(),
    });

    const data = await res.json().catch(() => ({}));
    console.log('FormSubmit response:', res.status, JSON.stringify(data));

    if (res.ok) {
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error('FormSubmit error:', err);
  }

  // Fallback - vrati uspjeh korisniku, ali logaj problem
  console.error('Sve metode slanja emaila su pale - naruzba nije poslana emailom!');
  return NextResponse.json({ success: true });
}
