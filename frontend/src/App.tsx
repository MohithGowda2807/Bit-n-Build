import React, { useEffect, useState } from 'react';
import { CommandCenter } from './pages/CommandCenter';
import { SurveillancePage } from './pages/SurveillancePage';
import { CasePage } from './pages/CasePage';
import { TopBar, Domain } from './components/shell/TopBar';
import { telemetry } from './services/telemetry';

const SUBTITLES: Record<Domain, string> = {
  logistics: 'Logistics · Route optimization',
  environment: 'Environment · Phase 2',
  surveillance: 'Surveillance · Eastern Arabian Sea',
  cleanup: 'Cleanup · Phase 4',
  agents: 'Agents · TRITON orchestrator',
};

function useTelemetryLive(): boolean {
  const [live, setLive] = useState(telemetry.connected);
  useEffect(() => {
    telemetry.start();
    const offOpen = telemetry.subscribe('$open', () => setLive(true));
    const offClose = telemetry.subscribe('$close', () => setLive(false));
    return () => { offOpen(); offClose(); };
  }, []);
  return live;
}

export function App() {
  const [domain, setDomain] = useState<Domain>('surveillance');
  const [caseId, setCaseId] = useState<number | null>(null);
  const [focusVessel, setFocusVessel] = useState<number | null>(null);
  const live = useTelemetryLive();

  return (
    <div className="h-screen flex flex-col bg-os-void text-os-fog">
      <TopBar domain={domain} onDomainChange={setDomain} subtitle={SUBTITLES[domain]} live={live} />
      {domain === 'surveillance' ? (
        caseId !== null ? (
          <CasePage caseId={caseId} onBack={() => setCaseId(null)} onShowOnMap={v => { setFocusVessel(v); setCaseId(null); }} />
        ) : (
          <SurveillancePage initialSelectedId={focusVessel} onOpenCase={setCaseId} />
        )
      ) : (
        <div className="flex-1 min-h-0 overflow-auto">
          <CommandCenter />
        </div>
      )}
    </div>
  );
}

export default App;
