'use client';

import { useMemo, useState } from 'react';

const sampleKeywords = [
  { keyword: 'pflegedienst stuttgart', volume: 1900, position: 11.3, change: 3.7, cpc: 4.8, intent: 'Anbieter', score: 94 },
  { keyword: 'ambulante pflege stuttgart', volume: 720, position: 8.9, change: 6.1, cpc: 3.9, intent: 'Anbieter', score: 91 },
  { keyword: 'verhinderungspflege stuttgart', volume: 590, position: 18.2, change: 2.4, cpc: 3.2, intent: 'Leistung', score: 88 },
  { keyword: 'pflegeberatung stuttgart', volume: 390, position: 6.7, change: 1.9, cpc: 2.7, intent: 'Beratung', score: 79 },
  { keyword: 'pflege zuhause kosten', volume: 1300, position: 24.6, change: -1.3, cpc: 4.1, intent: 'Kosten', score: 86 },
];

const competitorRows = [
  { name: 'pflege-mueller.de', visibility: 81, top10: 71, keywords: 382, gap: 0 },
  { name: 'Kundenprojekt', visibility: 64, top10: 35, keywords: 138, gap: 37 },
  { name: 'pflege-aktiv.de', visibility: 53, top10: 28, keywords: 207, gap: 21 },
];

const socialRows = [
  { platform: 'Instagram', impressions: '4.821', clicks: 183, posts: 17, query: 'pflege zuhause kosten' },
  { platform: 'YouTube', impressions: '2.140', clicks: 96, posts: 6, query: 'pflegegrad beantragen' },
  { platform: 'TikTok', impressions: '1.286', clicks: 51, posts: 9, query: 'ambulante pflege erklärt' },
];

function Icon({ children }) { return <span className="icon">{children}</span>; }
function Gauge({ value, label }) { return <div className="gauge" style={{ '--value': `${value * 3.6}deg` }}><div><b>{value}</b><span>{label}</span></div></div>; }
function Integration({ name, desc, status }) { const live = status === 'Live'; return <article className="integration"><div className={live ? 'integration-icon live' : 'integration-icon'}>{live ? '✓' : '◇'}</div><div><b>{name}</b><span>{desc}</span></div><i className={live ? 'status live' : 'status'}>{status}</i></article>; }

export default function Page() {
  const [tab, setTab] = useState('Übersicht');
  const [domain, setDomain] = useState('digitalegewinner.de');
  const [audit, setAudit] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [keyword, setKeyword] = useState('pflegedienst stuttgart');
  const [keywordResult, setKeywordResult] = useState(null);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const nav = ['Übersicht', 'Keywords', 'Website Audit', 'Konkurrenz', 'Social Search', 'Reports', 'Integrationen'];
  const activeKeywords = useMemo(() => sampleKeywords.filter(k => k.keyword.includes(keyword.toLowerCase()) || keyword.length < 3), [keyword]);

  async function runAudit() {
    setAuditLoading(true); setNotice('');
    try {
      const res = await fetch('/api/audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: domain }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAudit(data); setTab('Website Audit');
    } catch (e) { setNotice(e.message); }
    finally { setAuditLoading(false); }
  }

  async function runKeyword() {
    setKeywordLoading(true); setKeywordResult(null); setNotice('');
    try {
      const res = await fetch('/api/keywords', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ keyword }) });
      const data = await res.json();
      setKeywordResult(data);
      if (!res.ok && !data.connected) setNotice('DataForSEO ist vorbereitet, aber noch nicht mit Zugangsdaten verbunden.');
    } catch (e) { setNotice(e.message); }
    finally { setKeywordLoading(false); }
  }

  return <main className="app-shell">
    <aside className="sidebar no-print">
      <div className="brand"><div className="brandmark">DG</div><div><b>SEO Radar</b><span>Digitale Gewinner</span></div></div>
      <nav>{nav.map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}><Icon>{item === 'Übersicht' ? '⌂' : item === 'Keywords' ? '⌕' : item === 'Reports' ? '▤' : item === 'Integrationen' ? '⌘' : '◇'}</Icon>{item}</button>)}</nav>
      <div className="side-card"><span className="eyebrow">Datenstatus</span><b>2 von 6 Quellen</b><div className="progress"><i style={{ width: '34%' }} /></div><small>Website Audit live · API-Module bereit</small><button onClick={() => setTab('Integrationen')}>Quellen verbinden →</button></div>
      <div className="user"><span>RH</span><div><b>Raphael</b><small>Admin</small></div></div>
    </aside>

    <section className="workspace">
      <header className="topbar no-print"><div><span className="crumb">DIGITALE GEWINNER / SEO RADAR</span><h1>{tab}</h1></div><div className="top-actions"><span className="live-dot">Live</span><button className="ghost" onClick={() => setTab('Reports')}>Report öffnen</button><button className="primary" onClick={() => setTab('Integrationen')}>+ Datenquelle</button></div></header>
      {notice && <div className="notice no-print">{notice}<button onClick={() => setNotice('')}>×</button></div>}

      {tab === 'Übersicht' && <>
        <section className="hero-card"><div><span className="eyebrow">Digital Visibility Score</span><h2>Sie werden sichtbarer.<br/><em>Und zwar dort, wo Kunden suchen.</em></h2><p>Google, Website, Social Search und Wettbewerber in einer priorisierten Wachstumsansicht.</p></div><Gauge value={84} label="sehr gut" /></section>
        <section className="metric-grid"><article><span>Google Impressionen</span><b>18.420</b><small className="up">↗ 32,6 % zum Vormonat</small></article><article><span>Organische Klicks</span><b>481</b><small className="up">↗ 35,9 % zum Vormonat</small></article><article><span>Top-10 Keywords</span><b>35</b><small className="up">+7 neue Rankings</small></article><article><span>Opportunity Value</span><b>€ 38,4k</b><small>modelliertes Monats-Potential</small></article></section>
        <section className="two-col">
          <article className="panel opportunity"><div className="panel-head"><div><span className="eyebrow">Priorität #1</span><h3>Größte Wachstumschance</h3></div><span className="score">94 / 100</span></div><h4>pflegedienst stuttgart</h4><div className="op-meta"><div><span>Suchvolumen</span><b>1.900</b></div><div><span>Position</span><b>11,3</b></div><div><span>CPC</span><b>4,80 €</b></div></div><p>Sie stehen direkt vor Seite 1. Content-Optimierung und stärkere interne Verlinkung haben hier den höchsten erwartbaren Hebel.</p><button onClick={() => { setKeyword('pflegedienst stuttgart'); setTab('Keywords'); }}>Chance analysieren →</button></article>
          <article className="panel"><div className="panel-head"><div><span className="eyebrow">Sichtbarkeitsverlauf</span><h3>Momentum</h3></div><span className="up">+38 %</span></div><div className="chart"><svg viewBox="0 0 600 190" preserveAspectRatio="none"><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".18"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0,160 C80,155 85,118 150,124 S250,98 300,112 S390,72 430,79 S510,38 600,25 L600,190 L0,190 Z"/><path className="line" d="M0,160 C80,155 85,118 150,124 S250,98 300,112 S390,72 430,79 S510,38 600,25"/></svg></div><div className="axis"><span>Mär</span><span>Apr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Aug</span></div></article>
        </section>
        <section className="panel"><div className="panel-head"><div><span className="eyebrow">Action Feed</span><h3>Was jetzt den größten Unterschied macht</h3></div><span className="pill">7 Chancen</span></div><div className="action-list"><div><span className="action-icon">↗</span><div><b>Ranking auf Seite 1 schieben</b><small>„pflegedienst stuttgart“ · Position 11,3 · 1.900 Suchen</small></div><strong>Sehr hoch</strong></div><div><span className="action-icon">＋</span><div><b>Neue Landingpage erstellen</b><small>„verhinderungspflege stuttgart“ · Content Gap erkannt</small></div><strong>Hoch</strong></div><div><span className="action-icon">◎</span><div><b>Gewinner-Thema crossmedial nutzen</b><small>„pflege zuhause kosten“ funktioniert in Social Search</small></div><strong>Hoch</strong></div></div></section>
      </>}

      {tab === 'Keywords' && <section className="panel page-panel"><div className="panel-head"><div><span className="eyebrow">Keyword Intelligence</span><h3>Suchnachfrage & Money Keywords</h3></div><span className="demo-badge">Beispieldaten bis API-Verbindung</span></div><div className="search-row no-print"><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Keyword eingeben…"/><button className="primary" onClick={runKeyword}>{keywordLoading ? 'Prüfe…' : 'Live-Suchvolumen prüfen'}</button></div>{keywordResult && <div className={`api-result ${keywordResult.connected ? 'ok' : ''}`}>{keywordResult.connected && keywordResult.item ? <><b>{keywordResult.item.keyword}</b><span>Suchvolumen: {keywordResult.item.search_volume ?? '—'} · CPC: {keywordResult.item.cpc ?? '—'}</span></> : <><b>DataForSEO bereit</b><span>Zugangsdaten in Vercel hinterlegen, dann kommen hier echte Live-Daten.</span></>}</div>}<div className="table"><div className="tr head"><span>Keyword</span><span>Volumen</span><span>Position</span><span>CPC</span><span>Intent</span><span>Chance</span></div>{(activeKeywords.length ? activeKeywords : sampleKeywords).map(k => <div className="tr" key={k.keyword}><span><b>{k.keyword}</b><small className={k.change >= 0 ? 'up' : 'down'}>{k.change >= 0 ? '↗' : '↘'} {Math.abs(k.change)} Positionen</small></span><span>{k.volume.toLocaleString('de-DE')}</span><span>{k.position}</span><span>{k.cpc.toFixed(2)} €</span><span><i className="intent">{k.intent}</i></span><span><b className="chance">{k.score}</b></span></div>)}</div></section>}

      {tab === 'Website Audit' && <section className="panel page-panel"><div className="panel-head"><div><span className="eyebrow">Live Website Audit</span><h3>Technik, Struktur & Onpage</h3></div>{audit && <span className="pill">Live geprüft</span>}</div><div className="search-row no-print"><input value={domain} onChange={e => setDomain(e.target.value)} placeholder="https://beispiel.de"/><button className="primary" onClick={runAudit}>{auditLoading ? 'Analysiere…' : 'Website live analysieren'}</button></div>{audit ? <><div className="audit-top"><Gauge value={audit.score} label="SEO Score"/><div><span className="eyebrow">Analysierte URL</span><h4>{audit.url}</h4><p>{audit.title || 'Kein Seitentitel gefunden'}</p><small>HTTP {audit.status} · {audit.h1Count} H1 · {audit.h2Count} H2 · {audit.imageCount} Bilder</small></div></div><div className="audit-grid"><div><span>Seitentitel</span><b>{audit.title || 'Fehlt'}</b></div><div><span>H1</span><b>{audit.h1 || 'Fehlt'}</b></div><div><span>Meta Description</span><b>{audit.description || 'Fehlt'}</b></div><div><span>Canonical</span><b>{audit.canonical || 'Nicht erkannt'}</b></div></div><h4 className="section-title">Gefundene Punkte</h4><div className="issues">{audit.issues.length ? audit.issues.map((i, idx) => <div key={idx}><i className={i.level}></i><span>{i.text}</span><b>{i.level === 'high' ? 'Wichtig' : i.level === 'medium' ? 'Optimieren' : 'Hinweis'}</b></div>) : <div><i className="good"></i><span>Keine offensichtlichen Onpage-Probleme auf der Startseite gefunden.</span><b>Sauber</b></div>}</div></> : <div className="empty-state"><div>⌁</div><h4>Eine Domain. Ein klarer Befund.</h4><p>Die Analyse ruft die Website live ab und prüft bereits Title, Description, H1/H2, Canonical, noindex, Bilder und interne Links.</p></div>}</section>}

      {tab === 'Konkurrenz' && <section className="panel page-panel"><div className="panel-head"><div><span className="eyebrow">Competitor Intelligence</span><h3>Wer gewinnt die Nachfrage?</h3></div><span className="demo-badge">SERP API vorbereitet</span></div><div className="competitor-cards">{competitorRows.map((c, i) => <article key={c.name} className={i === 1 ? 'customer' : ''}><span>{i === 1 ? 'Ihre Website' : `Wettbewerber #${i === 0 ? 1 : 2}`}</span><h4>{c.name}</h4><div className="visibility"><i style={{ width: `${c.visibility}%` }}/></div><div className="mini-stats"><div><b>{c.keywords}</b><span>Keywords</span></div><div><b>{c.top10}</b><span>Top 10</span></div><div><b>{c.gap || '—'}</b><span>Content Gaps</span></div></div></article>)}</div><div className="insight-box"><span>Strategischer Befund</span><h4>37 relevante Keywords fehlen Ihrem Projekt.</h4><p>Davon sind 8 kommerziell besonders interessant. Diese Themen bilden die priorisierte Content-Roadmap, sobald die SERP-Datenquelle verbunden ist.</p></div></section>}

      {tab === 'Social Search' && <section className="panel page-panel"><div className="panel-head"><div><span className="eyebrow">Social Search Visibility</span><h3>Wenn Social Content bei Google auftaucht</h3></div><span className="demo-badge">Search Console Plattform-Property</span></div><div className="social-summary"><article><span>Google-Impressionen</span><b>8.247</b><small>über Social Content</small></article><article><span>Google-Klicks</span><b>330</b><small>auf Social Posts</small></article><article><span>Indexierte Gewinner</span><b>32</b><small>Posts & Videos</small></article></div><div className="table social-table"><div className="tr head"><span>Plattform</span><span>Impressionen</span><span>Klicks</span><span>Posts</span><span>Top-Suchanfrage</span></div>{socialRows.map(r => <div className="tr" key={r.platform}><span><b>{r.platform}</b></span><span>{r.impressions}</span><span>{r.clicks}</span><span>{r.posts}</span><span>{r.query}</span></div>)}</div><div className="insight-box accent"><span>Content Intelligence</span><h4>„pflege zuhause kosten“ ist ein Cross-Channel-Gewinner.</h4><p>Aus einem erfolgreichen Social-Thema sollte eine suchoptimierte Website-Seite entstehen. So wird Content nicht nur produziert, sondern mehrfach verwertet.</p></div></section>}

      {tab === 'Reports' && <section className="report-wrap"><div className="report-toolbar no-print"><div><b>Executive Report · August 2026</b><span>Vorschau der Kundenansicht</span></div><button className="primary" onClick={() => window.print()}>Als PDF speichern / drucken</button></div><article className="report"><header><div className="brand"><div className="brandmark">DG</div><div><b>Digitale Gewinner</b><span>Performance Report</span></div></div><span>August 2026</span></header><div className="report-hero"><span className="eyebrow">Ihre digitale Entwicklung</span><h2>Mehr Sichtbarkeit.<br/><em>Mehr gefundene Chancen.</em></h2><p>Die wichtigsten Ergebnisse aus Google, Website und Social Search – verständlich zusammengefasst.</p></div><div className="report-kpis"><div><b>+32,6 %</b><span>Google-Sichtbarkeit</span></div><div><b>+35,9 %</b><span>organische Klicks</span></div><div><b>+7</b><span>neue Top-10 Rankings</span></div><div><b>€ 38,4k</b><span>Opportunity Value*</span></div></div><section><span className="eyebrow">Management Summary</span><h3>Was diesen Monat zählt</h3><p>Die Sichtbarkeit wächst deutlich. Besonders Keywords kurz vor der ersten Google-Seite bieten jetzt den größten Hebel. Parallel zeigt Social Search, welche Themen bereits Nachfrage erzeugen und sich für neue Landingpages eignen.</p></section><section className="report-highlight"><span>Größte Chance</span><h3>„pflegedienst stuttgart“ von Position 11,3 in die Top 5 entwickeln.</h3><p>1.900 monatliche Suchanfragen · hoher kommerzieller Intent · klare Priorität für Content und interne Verlinkung.</p></section><section><span className="eyebrow">Nächste Maßnahmen</span><div className="next-actions"><div><b>01</b><span><strong>Money Keyword pushen</strong>„pflegedienst stuttgart“ optimieren</span></div><div><b>02</b><span><strong>Content Gap schließen</strong>Landingpage „Verhinderungspflege Stuttgart“</span></div><div><b>03</b><span><strong>Social Winner skalieren</strong>„Pflege zuhause Kosten“ als Ratgeber</span></div></div></section><footer>* Opportunity Value ist ein modellierter Orientierungswert und kein Umsatzversprechen.</footer></article></section>}

      {tab === 'Integrationen' && <section className="panel page-panel"><div className="panel-head"><div><span className="eyebrow">Datenquellen</span><h3>Einmal verbinden. Danach automatisch.</h3></div><span className="pill">2 / 6 vorbereitet</span></div><div className="integration-grid"><Integration name="Live Website Audit" desc="Eigener Crawler · Title, Headings, Meta, Links" status="Live"/><Integration name="DataForSEO" desc="Suchvolumen, CPC, SERPs, Wettbewerber" status="Env Vars fehlen"/><Integration name="Google Search Console" desc="Klicks, Impressionen, CTR, Positionen" status="Als Nächstes"/><Integration name="Google PageSpeed / CrUX" desc="Performance & echte Nutzerdaten" status="Geplant"/><Integration name="Instagram / Social Search" desc="Platform Properties über Search Console" status="Geplant"/><Integration name="Supabase" desc="Snapshots, Projekte, Reports, Historie" status="Geplant"/></div><div className="setup-card"><span className="eyebrow">DataForSEO aktivieren</span><h4>2 Vercel-Variablen reichen</h4><code>DATAFORSEO_LOGIN</code><code>DATAFORSEO_PASSWORD</code><p>Der Keyword-Endpunkt ist bereits eingebaut. Sobald die Zugangsdaten hinterlegt sind, liefert die Suche echte Daten statt Demo-Werten.</p></div></section>}
    </section>
  </main>;
}
