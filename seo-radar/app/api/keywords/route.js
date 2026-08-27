import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  const { keyword = '', location = 'Germany', language = 'de' } = await request.json();
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return NextResponse.json({
      connected: false,
      error: 'DataForSEO ist noch nicht verbunden.',
      keyword,
      setup: ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD'],
    }, { status: 503 });
  }

  try {
    const auth = Buffer.from(`${login}:${password}`).toString('base64');
    const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Basic ${auth}` },
      body: JSON.stringify([{ keywords: [keyword], location_name: location, language_code: language }]),
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok || data?.status_code >= 40000) throw new Error(data?.status_message || 'DataForSEO Anfrage fehlgeschlagen.');
    const item = data?.tasks?.[0]?.result?.[0] || null;
    return NextResponse.json({ connected: true, item });
  } catch (error) {
    return NextResponse.json({ connected: true, error: error.message }, { status: 502 });
  }
}
