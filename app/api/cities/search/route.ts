import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('cities')
      .select('name, slug, country_code')
      .ilike('name', `%${q}%`)
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
