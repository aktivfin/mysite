import { actions, getState } from '../state/store.js';

export class OpenClawSocket {
  constructor() {
    this.ws = null;
    this.reconnectTimer = null;
  }

  connect() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${location.hostname}:18789`;
    actions.setWsStatus('connecting', url);

    this.ws = new WebSocket(url);
    this.ws.onopen = () => actions.setWsStatus('connected', url);
    this.ws.onclose = () => {
      actions.setWsStatus('disconnected', url);
      this.scheduleReconnect();
    };
    this.ws.onerror = () => actions.setWsStatus('disconnected', url);
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') actions.addAiMessage(data.content || 'Пустой ответ OpenClaw');
      } catch {
        actions.addAiMessage(String(event.data));
      }
    };
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  send(text, mode = 'auto') {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    const state = getState();
    this.ws.send(JSON.stringify({
      type: 'chat',
      content: text,
      mode,
      projectId: state.currentProjectId,
      requestId: crypto.randomUUID(),
    }));
    return true;
  }
}
