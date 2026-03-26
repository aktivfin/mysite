import { actions, getState, routes } from '../state/store.js';

export function Sidebar() {
  const state = getState();
  const ws = state.connection;
  const dotClass = ws.wsStatus === 'connected' ? 'dot connected' : ws.wsStatus === 'connecting' ? 'dot connecting' : 'dot';

  return `
    <aside class="sidebar ${state.ui.sidebarOpen ? 'open' : ''}">
      <div class="brand">OpenClaw OS</div>
      <div class="ws-status"><span class="${dotClass}"></span>${ws.wsStatus}${ws.wsUrl ? ` · ${ws.wsUrl}` : ''}</div>
      <div>
        ${routes.map((route) => `
          <button class="nav-btn ${state.ui.route === route ? 'active' : ''}" data-nav="${route}">${route}</button>
        `).join('')}
      </div>
      <div class="card">
        <div style="margin-bottom:8px">Проект</div>
        <select class="select" id="project-select">
          ${state.projects.map((p) => `<option value="${p.id}" ${p.id === state.currentProjectId ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </div>
    </aside>
  `;
}

export function bindSidebar(root) {
  root.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => actions.navigate(button.dataset.nav));
  });
  root.querySelector('#project-select')?.addEventListener('change', (event) => {
    actions.setProject(event.target.value);
  });
}
