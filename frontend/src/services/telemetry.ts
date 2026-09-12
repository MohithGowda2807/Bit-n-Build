/** One shared WebSocket to /ws/telemetry, with typed subscriptions and automatic reconnect. */

type Handler = (data: any) => void;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = `${API_BASE.replace(/^http/, 'ws')}/ws/telemetry`;

class TelemetryClient {
  private socket: WebSocket | null = null;
  private handlers = new Map<string, Set<Handler>>();
  private retry: number | undefined;
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;
    this.connect();
  }

  private connect(): void {
    const socket = new WebSocket(WS_URL);
    this.socket = socket;
    socket.onopen = () => this.emit('$open', null);
    socket.onmessage = event => {
      let message: any;
      try { message = JSON.parse(event.data); } catch { return; }  // plain "pong"
      if (message?.type) this.emit(message.type, message.data ?? message);
    };
    socket.onclose = () => {
      this.emit('$close', null);
      this.retry = window.setTimeout(() => this.connect(), 5000);
    };
    socket.onerror = () => socket.close();
  }

  private emit(type: string, data: any): void {
    this.handlers.get(type)?.forEach(h => h(data));
  }

  subscribe(type: string, handler: Handler): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const telemetry = new TelemetryClient();
