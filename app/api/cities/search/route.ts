import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

function normalizeSearchQuery(str: string): string {
  return str
    // Turkish replacements
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    // German replacements
    .replace(/[äÄ]/g, 'a')
    .replace(/[ß]/g, 'ss')
    // Accent normalization
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const normalizedQuery = normalizeSearchQuery(q);
    const supabase = createAdminClient();
    
    // We search using the normalized English-equivalent query
    const { data, error } = await supabase
      .from('cities')
      .select('name, slug, country_code, lat, lng')
      .ilike('name', `%${normalizedQuery}%`)
      .limit(10);

    if (error) {
      console.error('Error searching cities:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error('Internal server error in city search API:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
