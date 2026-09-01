"use client";

import { useMemo, useState } from "react";

type Inputs = {
  company: string;
  website: string;
  monthlyCalls: number;
  missedRate: number;
  qualifiedRate: number;
  closeRate: number;
  avgOrderValue: number;
  monthlyFee: number;
};

const defaultInputs: Inputs = {
  company: "Musterbetrieb GmbH",
  website: "https://musterbetrieb.de",
  monthlyCalls: 300,
  missedRate: 25,
  qualifiedRate: 40,
  closeRate: 25,
  avgOrderValue: 2000,
  monthlyFee: 990,
};

function euro(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Page() {
  const [inputs, setInputs] = useState(defaultInputs);

  const model = useMemo(() => {
    const missedCalls = inputs.monthlyCalls * (inputs.missedRate / 100);
    const qualifiedMissedLeads = missedCalls * (inputs.qualifiedRate / 100);
    const potentialCustomers = qualifiedMissedLeads * (inputs.closeRate / 100);
    const estimatedLeak = potentialCustomers * inputs.avgOrderValue;
    const estimatedRoi = inputs.monthlyFee > 0 ? estimatedLeak / inputs.monthlyFee : 0;

    return { missedCalls, qualifiedMissedLeads, potentialCustomers, estimatedLeak, estimatedRoi };
  }, [inputs]);

  function setNumber(key: keyof Inputs, value: string) {
    setInputs((current) => ({ ...current, [key]: Number(value) || 0 }));
  }

  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow">MISSED-CALL REVENUE RECOVERY</div>
        <h1>Kein kaufbereiter Anruf soll mehr verschwinden.</h1>
        <p className="lead">
          Ein spezialisiertes System für genau ein Problem: unbeantwortete eingehende Neukunden-Anrufe erkennen,
          übernehmen, qualifizieren und ihren tatsächlichen Umsatz messbar machen.
        </p>
        <div className="promise">
          <span>Ein Problem</span><span>Eine Kennzahl</span><span>Eine Garantie</span><span>Ein Installer</span>
        </div>
      </section>

      <section className="shell grid">
        <div className="panel">
          <div className="panelTitle">Revenue Leak Audit</div>
          <p className="muted">Verkaufs-Schätzung — nicht mit später attribuiertem Live-Umsatz vermischen.</p>

          <label>Unternehmen<input value={inputs.company} onChange={(e) => setInputs({ ...inputs, company: e.target.value })} /></label>
          <label>Website<input value={inputs.website} onChange={(e) => setInputs({ ...inputs, website: e.target.value })} /></label>

          <div className="two">
            <label>Anrufe / Monat<input type="number" value={inputs.monthlyCalls} onChange={(e) => setNumber("monthlyCalls", e.target.value)} /></label>
            <label>Nicht angenommen %<input type="number" value={inputs.missedRate} onChange={(e) => setNumber("missedRate", e.target.value)} /></label>
            <label>Davon qualifiziert %<input type="number" value={inputs.qualifiedRate} onChange={(e) => setNumber("qualifiedRate", e.target.value)} /></label>
            <label>Abschlussquote %<input type="number" value={inputs.closeRate} onChange={(e) => setNumber("closeRate", e.target.value)} /></label>
            <label>Ø Auftragswert €<input type="number" value={inputs.avgOrderValue} onChange={(e) => setNumber("avgOrderValue", e.target.value)} /></label>
            <label>Monatsgebühr €<input type="number" value={inputs.monthlyFee} onChange={(e) => setNumber("monthlyFee", e.target.value)} /></label>
          </div>
        </div>

        <div className="panel dark">
          <div className="panelTitle">Geschätztes Umsatzleck</div>
          <div className="money">{euro(model.estimatedLeak)}<small>/ Monat</small></div>
          <div className="stats">
            <div><strong>{Math.round(model.missedCalls)}</strong><span>verpasste Calls</span></div>
            <div><strong>{Math.round(model.qualifiedMissedLeads)}</strong><span>qualifizierte Leads</span></div>
            <div><strong>{model.potentialCustomers.toFixed(1)}</strong><span>potenzielle Kunden</span></div>
            <div><strong>{model.estimatedRoi.toFixed(1)}×</strong><span>theoretischer ROI</span></div>
          </div>
          <div className="rule" />
          <p>
            Im Live-System zählt für die Garantie ausschließlich <b>eindeutig attribuierter, als gewonnen bestätigter Umsatz</b>.
            Termine und Schätzwerte werden separat ausgewiesen.
          </p>
        </div>
      </section>

      <section className="shell flow">
        <div className="flowItem"><b>01</b><span>Normaler Anruf</span><small>Mitarbeiter bekommt zuerst die Chance.</small></div>
        <div className="arrow">→</div>
        <div className="flowItem"><b>02</b><span>Nicht angenommen</span><small>Weiterleitung nach definierter Klingeldauer.</small></div>
        <div className="arrow">→</div>
        <div className="flowItem"><b>03</b><span>AI Recovery</span><small>Offen als KI gekennzeichnet, qualifiziert und hilft.</small></div>
        <div className="arrow">→</div>
        <div className="flowItem"><b>04</b><span>Termin / Übergabe</span><small>Kalender, CRM oder Live-Transfer.</small></div>
        <div className="arrow">→</div>
        <div className="flowItem"><b>05</b><span>Revenue Proof</span><small>Deal gewinnt → Umsatz wird attribuiert.</small></div>
      </section>

      <section className="shell activation">
        <div>
          <div className="eyebrow">1-CLICK INSTALLER — ZIELBILD</div>
          <h2>Website rein. Telefonnummer verbinden. Kalender wählen. Aktivieren.</h2>
        </div>
        <ol>
          <li>Website crawlen → Leistungen, Regionen, Öffnungszeiten, FAQ.</li>
          <li>Assistant-Konfiguration und Qualifizierungsfragen generieren.</li>
          <li>Rufumleitung bei Nichtannahme mit eindeutiger Tracking-Nummer verbinden.</li>
          <li>Kalender / CRM anbinden und Revenue-Status synchronisieren.</li>
          <li>Automatische Testcalls und Go-Live-Check bestehen.</li>
        </ol>
      </section>
    </main>
  );
}
