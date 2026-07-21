import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_LIFETIME_PRICE_ID!, quantity: 1 }],
      customer_email: email ?? user.email,
      metadata: { userId: user.id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/results?success=true`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/results?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Failed to create session:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}