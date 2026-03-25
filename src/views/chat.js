import { actions, getState } from '../state/store.js';

export function renderChat() {
  const state = getState();
  return `
    <section class="content">
      <div class="card">
        <h2>AI Chat</h2>
        <div class="list" id="chat-list" style="max-height:45vh;overflow:auto;margin-bottom:10px">
          ${state.messages.map((m) => `<div class="message ${m.role === 'user' ? 'user' : 'ai'}"><strong>${m.role === 'user' ? 'Вы' : 'AI'}:</strong> ${escapeHtml(m.text)}</div>`).join('')}
        </div>
        <div class="row">
          <textarea class="textarea" id="chat-input" rows="2" placeholder="Введите сообщение"></textarea>
          <button class="btn primary" id="chat-send">Отправить</button>
        </div>
      </div>
    </section>
  `;
}

export function bindChat(root, wsClient) {
  root.querySelector('#chat-send')?.addEventListener('click', () => {
    const input = root.querySelector('#chat-input');
    const text = input.value.trim();
    if (!text) return;
    actions.addUserMessage(text);
    const sent = wsClient.send(text);
    if (!sent) actions.addAiMessage('OpenClaw недоступен. Локальный режим.');
    input.value = '';
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
