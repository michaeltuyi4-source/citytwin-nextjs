import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICES = {
  lifetime: process.env.STRIPE_LIFETIME_PRICE_ID!,
  monthly:  process.env.STRIPE_MONTHLY_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  const { plan, userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: plan === 'monthly' ? 'subscription' : 'payment',
    line_items: [{ price: PRICES[plan as keyof typeof PRICES], quantity: 1 }],
    customer_email: email,
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/results?success=true`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/results?cancelled=true`,
  });

  return NextResponse.json({ url: session.url });
}