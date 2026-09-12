import React, { useEffect, useState } from 'react';
import { LogisticsPage } from './pages/LogisticsPage';
import { AgentsPage } from './pages/AgentsPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { CleanupPage } from './pages/CleanupPage';
import { SurveillancePage } from './pages/SurveillancePage';
import { CasePage } from './pages/CasePage';
import { TopBar, Domain } from './components/shell/TopBar';
import { telemetry } from './services/telemetry';

const SUBTITLES: Record<Domain, string> = {
  logistics: 'Logistics · Route optimization',
  environment: 'Environment · Conditions and advisories',
  surveillance: 'Surveillance · Eastern Arabian Sea',
  cleanup: 'Cleanup · Debris and missions',
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
      ) : domain === 'logistics' ? (
        <LogisticsPage />
      ) : domain === 'agents' ? (
        <AgentsPage />
      ) : domain === 'environment' ? (
        <EnvironmentPage />
      ) : (
        <CleanupPage />
      )}
    </div>
  );
}

export default App;
