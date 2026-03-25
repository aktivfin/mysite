import { actions, getState } from '../state/store.js';

export function Header() {
  const state = getState();
  return `
    <header class="header">
      <div class="row">
        <button class="btn mobile-toggle" id="menu-toggle">☰</button>
        <strong>${state.ui.route.toUpperCase()}</strong>
      </div>
      <div style="color:var(--muted)">${state.projects.find((p) => p.id === state.currentProjectId)?.name || ''}</div>
    </header>
  `;
}

export function bindHeader(root) {
  root.querySelector('#menu-toggle')?.addEventListener('click', () => actions.toggleSidebar());
}
