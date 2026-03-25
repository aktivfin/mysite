import { actions, getState } from '../state/store.js';

export function renderTasks() {
  const state = getState();
  const tasks = state.tasks.filter((task) => task.projectId === state.currentProjectId);
  return `
    <section class="content">
      <div class="card">
        <h2>Задачи</h2>
        <div class="row" style="margin-bottom:10px">
          <input class="input" id="task-title" placeholder="Новая задача" />
          <button class="btn primary" id="task-add">Добавить</button>
        </div>
        <div class="list">
          ${tasks.map((task) => `<button class="message" data-task="${task.id}">${task.done ? '✅' : '⬜'} ${task.title}</button>`).join('') || '<div style="color:var(--muted)">Нет задач</div>'}
        </div>
      </div>
    </section>
  `;
}

export function bindTasks(root) {
  root.querySelector('#task-add')?.addEventListener('click', () => {
    const input = root.querySelector('#task-title');
    actions.addTask(input.value);
    input.value = '';
  });
  root.querySelectorAll('[data-task]').forEach((node) => {
    node.addEventListener('click', () => actions.toggleTask(node.dataset.task));
  });
}
