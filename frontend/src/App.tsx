import React, { useEffect, useState } from 'react';
import { CommandCenter } from './pages/CommandCenter';
import { SurveillancePage } from './pages/SurveillancePage';
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
  const live = useTelemetryLive();

  return (
    <div className="h-screen flex flex-col bg-os-void text-os-fog">
      <TopBar domain={domain} onDomainChange={setDomain} subtitle={SUBTITLES[domain]} live={live} />
      {domain === 'surveillance' ? (
        <SurveillancePage />
      ) : (
        <div className="flex-1 min-h-0 overflow-auto">
          <CommandCenter />
        </div>
      )}
    </div>
  );
}

export default App;
