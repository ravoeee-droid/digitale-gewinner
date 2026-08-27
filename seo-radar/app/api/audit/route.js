import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function normalizeUrl(input) {
  const trimmed = String(input || '').trim();
  if (!trimmed) throw new Error('Bitte eine Domain eingeben.');
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function stripTags(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function firstMatch(html, regex) {
  return stripTags(html.match(regex)?.[1] || '');
}

function countMatches(html, regex) {
  return (html.match(regex) || []).length;
}

export async function POST(request) {
  try {
    const { url: rawUrl } = await request.json();
    const url = normalizeUrl(rawUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'DigitaleGewinner-SEORadar/0.1 (+site-audit)' },
      cache: 'no-store',
    });
    clearTimeout(timer);

    if (!response.ok) {
      return NextResponse.json({ error: `Website antwortet mit HTTP ${response.status}.` }, { status: 400 });
    }

    const html = await response.text();
    const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
      || firstMatch(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
    const h1 = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
    const h2Count = countMatches(html, /<h2\b[^>]*>/gi);
    const imageCount = countMatches(html, /<img\b[^>]*>/gi);
    const imagesMissingAlt = (html.match(/<img\b(?![^>]*\balt\s*=)[^>]*>/gi) || []).length;
    const internalLinks = (html.match(/<a\b[^>]*href=["'](?:\/|#|\.\/)[^"']*["'][^>]*>/gi) || []).length;
    const canonical = firstMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
      || firstMatch(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
    const robotsNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);

    let score = 100;
    const issues = [];
    if (!title) { score -= 18; issues.push({ level: 'high', text: 'Seitentitel fehlt' }); }
    else if (title.length < 30 || title.length > 65) { score -= 6; issues.push({ level: 'medium', text: 'Seitentitel hat keine ideale Länge' }); }
    if (!description) { score -= 12; issues.push({ level: 'high', text: 'Meta Description fehlt' }); }
    if (!h1) { score -= 15; issues.push({ level: 'high', text: 'H1 fehlt' }); }
    if (h1Count > 1) { score -= 6; issues.push({ level: 'medium', text: `${h1Count} H1-Überschriften gefunden` }); }
    if (!canonical) { score -= 5; issues.push({ level: 'low', text: 'Canonical-Link nicht erkannt' }); }
    if (robotsNoindex) { score -= 25; issues.push({ level: 'high', text: 'Seite ist auf noindex gesetzt' }); }
    if (imagesMissingAlt > 0) { score -= Math.min(10, imagesMissingAlt * 2); issues.push({ level: 'medium', text: `${imagesMissingAlt} Bilder ohne Alt-Attribut` }); }

    return NextResponse.json({
      url: response.url,
      status: response.status,
      score: Math.max(0, score),
      title,
      description,
      h1,
      h1Count,
      h2Count,
      imageCount,
      imagesMissingAlt,
      internalLinks,
      canonical,
      robotsNoindex,
      issues,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'Website-Analyse hat zu lange gedauert.' : (error?.message || 'Analyse fehlgeschlagen.');
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
