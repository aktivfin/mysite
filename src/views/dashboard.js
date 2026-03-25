import { getState } from '../state/store.js';

export function renderDashboard() {
  const state = getState();
  const projectTasks = state.tasks.filter((task) => task.projectId === state.currentProjectId);
  const open = projectTasks.filter((task) => !task.done).length;
  return `
    <section class="content">
      <div class="card"><h2>Сегодня</h2><p>Открытых задач: <strong>${open}</strong></p></div>
      <div class="card"><p>Меню стабильно и управляется через централизованный state.</p></div>
    </section>
  `;
}
