import { NextResponse } from 'next/server';
import { getFuelPrices } from '@/lib/fuel-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const city = searchParams.get('city');

  if (!country || !city) {
    return NextResponse.json({ error: 'Missing country or city parameter' }, { status: 400 });
  }

  try {
    const prices = await getFuelPrices(country, city);
    if (!prices) {
      return NextResponse.json({ error: 'City prices not found' }, { status: 404 });
    }
    return NextResponse.json(prices);
  } catch (err: any) {
    console.error('Error in /api/cities/prices:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
