import React, { useEffect, useRef, useState } from 'react';
import { CommandCenter } from './pages/CommandCenter';
import { SurveillancePage } from './pages/SurveillancePage';
import { TopBar, Domain } from './components/shell/TopBar';

const SUBTITLES: Record<Domain, string> = {
  logistics: 'Logistics · Route optimization',
  environment: 'Environment · Phase 2',
  surveillance: 'Surveillance · Eastern Arabian Sea',
  cleanup: 'Cleanup · Phase 4',
  agents: 'Agents · TRITON orchestrator',
};

function useTelemetryLive(): boolean {
  const [live, setLive] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/^http/, 'ws');
    let retry: number | undefined;
    const connect = () => {
      const socket = new WebSocket(`${base}/ws/telemetry`);
      socketRef.current = socket;
      socket.onopen = () => setLive(true);
      socket.onclose = () => { setLive(false); retry = window.setTimeout(connect, 5000); };
      socket.onerror = () => socket.close();
    };
    connect();
    return () => { window.clearTimeout(retry); socketRef.current?.close(); };
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
