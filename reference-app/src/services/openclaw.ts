export interface OutboundChatMessage {
  requestId: string;
  projectId: string;
  text: string;
  mode: 'auto' | 'youtube' | 'script' | 'code' | 'image';
}

interface OpenClawEvents {
  onStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  onMessage: (payload: { requestId: string; text: string }) => void;
  onError: (error: Error) => void;
}

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly events: OpenClawEvents;
  private reconnectTimer: number | null = null;

  constructor(url: string, events: OpenClawEvents) {
    this.url = url;
    this.events = events;
  }

  connect() {
    this.events.onStatus('connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => this.events.onStatus('connected');

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        if (data.type === 'chat_reply') {
          this.events.onMessage({ requestId: data.requestId, text: data.text });
        }
      } catch (error) {
        this.events.onError(error as Error);
      }
    };

    this.ws.onclose = () => {
      this.events.onStatus('disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.events.onStatus('disconnected');
    };
  }

  sendChat(message: OutboundChatMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('OpenClaw WebSocket is not connected');
    }

    this.ws.send(
      JSON.stringify({
        type: 'chat_request',
        ...message,
      }),
    );
  }

  disconnect() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close();
    this.ws = null;
    this.events.onStatus('disconnected');
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }
}
