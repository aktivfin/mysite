import { getState } from '../state/store.js';

export function renderProjects() {
  const state = getState();
  return `
    <section class="content">
      <div class="card">
        <h2>Проекты</h2>
        <div class="list">
          ${state.projects.map((project) => `<div class="message">${project.name}</div>`).join('')}
        </div>
      </div>
    </section>
  `;
}
