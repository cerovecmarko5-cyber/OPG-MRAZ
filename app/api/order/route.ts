import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER and SMTP_PASS must be set.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const getSendGridFrom = () => {
  const fromValue = process.env.SENDGRID_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!fromValue) {
    return { email: '', name: 'OPG Mraz' };
  }

  const match = fromValue.match(/^(.+?)<(.+?)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }

  return { email: fromValue.trim(), name: 'OPG Mraz' };
};

const getOrderRecipientEmail = () => process.env.ORDER_RECIPIENT_EMAIL || 'opgmiromraz1904@gmail.com';

const formatItems = (items: Array<{ product: { name: string; price: number }; quantity: number }>) =>
  items
    .map(
      (item) => `- ${item.product.name} x ${item.quantity} = ${(item.product.price * item.quantity).toFixed(2)} €`
    )
    .join('\n');

const buildTextMessage = (payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  total: number;
}) => {
  const itemList = formatItems(payload.items);
  return `Nova narudžba iz OPG i DESTILERIJA Mraz\n\nIme: ${payload.name}\nEmail: ${payload.email}\nTelefon: ${payload.phone}\nAdresa: ${payload.address}\n\nProizvodi:\n${itemList}\n\nUkupno: ${payload.total.toFixed(2)} €\n`;
};

const buildHtmlMessage = (payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  total: number;
}) => {
  return `
        <h2>Nova narudžba</h2>
        <p><strong>Ime:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Telefon:</strong> ${payload.phone}</p>
        <p><strong>Adresa:</strong> ${payload.address}</p>
        <h3>Proizvodi</h3>
        <ul>
          ${payload.items
            .map(
              (item) =>
                `<li>${item.product.name} x ${item.quantity} = ${(item.product.price * item.quantity).toFixed(2)} €</li>`
            )
            .join('')}
        </ul>
        <p><strong>Ukupno:</strong> ${payload.total.toFixed(2)} €</p>
      `;
};

const sendViaSendGrid = async (payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  total: number;
}) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const recipient = getOrderRecipientEmail();
  const from = getSendGridFrom();

  if (!apiKey || !from.email) {
    throw new Error('SENDGRID_API_KEY and SENDGRID_FROM or SMTP_FROM must be set.');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: recipient }],
          subject: `Nova narudžba od ${payload.name}`,
        },
      ],
      from,
      reply_to: { email: payload.email },
      content: [
        { type: 'text/plain', value: buildTextMessage(payload) },
        { type: 'text/html', value: buildHtmlMessage(payload) },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid error: ${response.status} ${errorText}`);
  }
};

const sendViaSMTP = async (payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  total: number;
}) => {
  const transporter = createTransporter();
  const recipient = getOrderRecipientEmail();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: recipient,
    subject: `Nova narudžba od ${payload.name}`,
    text: buildTextMessage(payload),
    html: buildHtmlMessage(payload),
    replyTo: payload.email,
  });
};

const sendViaFormSubmit = async (payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  total: number;
}) => {
  const recipient = process.env.ORDER_RECIPIENT_EMAIL || 'opgmiromraz1904@gmail.com';
  const formBody = new URLSearchParams();
  formBody.append('name', payload.name);
  formBody.append('email', payload.email);
  formBody.append('phone', payload.phone);
  formBody.append('address', payload.address);
  formBody.append('items', formatItems(payload.items));
  formBody.append('total', `${payload.total.toFixed(2)} €`);
  formBody.append('_subject', `Nova narudžba od ${payload.name}`);
  formBody.append('_captcha', 'false');

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FormSubmit error: ${response.status} ${errorText}`);
  }
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, email, phone, address, items, total } = payload;

    if (!name || !email || !phone || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 });
    }

    const orderPayload = { name, email, phone, address, items, total };
    let sent = false;

    if (process.env.SENDGRID_API_KEY) {
      try {
        await sendViaSendGrid(orderPayload);
        sent = true;
      } catch (error) {
        console.error('SendGrid failed, trying SMTP/form fallback:', error);
      }
    }

    if (!sent && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await sendViaSMTP(orderPayload);
        sent = true;
      } catch (error) {
        console.error('SMTP failed, trying FormSubmit fallback:', error);
      }
    }

    if (!sent) {
      await sendViaFormSubmit(orderPayload);
      sent = true;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order send error:', error);
    return NextResponse.json(
      { error: 'Došlo je do pogreške pri slanju narudžbe. Molimo pokušajte ponovno.' },
      { status: 500 }
    );
  }
}
