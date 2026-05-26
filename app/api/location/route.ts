// app/api/location/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Use IP Geolocation (e.g., ipapi.co)
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  
  return NextResponse.json({
    city: data.city || 'Istanbul',
    country: data.country_code || 'TR' // ülke kodu döndür
  });
}
