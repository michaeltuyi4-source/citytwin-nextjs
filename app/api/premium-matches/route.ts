import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// @ts-ignore - JS module with no type declarations
import { getTopMatches } from '@/scoring';
// @ts-ignore - JS module with no type declarations
import { LIFESTYLE_CATEGORIES } from '@/neighborhoods';
import { ensureCityData } from '@/lib/neighborhoods-db';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single();

  if (profile?.tier !== 'premium') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { city, priorities } = await req.json();

  await ensureCityData(city);
  const allMatches = getTopMatches(city, priorities, LIFESTYLE_CATEGORIES);
  const premiumMatches = allMatches.slice(1); // matches #2 and #3 only

  return NextResponse.json({ matches: premiumMatches });
}
