import { subscribe, getState, actions } from './state/store.js';
import { Sidebar, bindSidebar } from './components/sidebar.js';
import { Header, bindHeader } from './components/header.js';
import { renderDashboard } from './views/dashboard.js';
import { renderChat, bindChat } from './views/chat.js';
import { renderProjects } from './views/projects.js';
import { renderTasks, bindTasks } from './views/tasks.js';

function renderView() {
  const route = getState().ui.route;
  if (route === 'dashboard') return renderDashboard();
  if (route === 'chat') return renderChat();
  if (route === 'projects') return renderProjects();
  if (route === 'tasks') return renderTasks();
  return '<section class="content"><div class="card">Not found</div></section>';
}

function renderLogin() {
  return `
    <div class="login-wrap">
      <div class="login-card">
        <h2>OpenClaw OS</h2>
        <p style="color:var(--muted)">Введите PIN</p>
        <input class="input" id="pin" type="password" maxlength="12" />
        <div class="row" style="margin-top:10px">
          <button class="btn primary" id="login-btn">Войти</button>
          <span id="login-error" style="color:#ff6b6b"></span>
        </div>
      </div>
    </div>
  `;
}

export function createApp(root, wsClient) {
  function mount() {
    const state = getState();

    if (!state.auth.isAuthenticated) {
      root.innerHTML = renderLogin();
      root.querySelector('#login-btn')?.addEventListener('click', async () => {
        const ok = await actions.login(root.querySelector('#pin')?.value || '');
        if (!ok) {
          root.querySelector('#login-error').textContent = 'Неверный PIN';
        }
      });
      return;
    }

    root.innerHTML = `
      <div class="app-shell">
        ${Sidebar()}
        <div class="main">
          ${Header()}
          ${renderView()}
        </div>
      </div>
    `;

    bindSidebar(root);
    bindHeader(root);
    if (state.ui.route === 'chat') bindChat(root, wsClient);
    if (state.ui.route === 'tasks') bindTasks(root);
  }

  mount();
  return subscribe(mount);
}
