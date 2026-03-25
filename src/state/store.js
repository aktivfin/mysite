export const routes = ['dashboard', 'chat', 'projects', 'tasks'];

const initialState = {
  auth: { isAuthenticated: false },
  ui: { route: 'dashboard', sidebarOpen: false },
  connection: { wsStatus: 'disconnected', wsUrl: '' },
  projects: [
    { id: 'youtube', name: 'YouTube' },
    { id: 'music', name: 'Музыка' },
    { id: 'book', name: 'Книга' },
  ],
  currentProjectId: 'youtube',
  tasks: [],
  messages: [],
};

let state = structuredClone(initialState);
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(updater) {
  const next = typeof updater === 'function' ? updater(state) : updater;
  state = next;
  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const actions = {
  login(pin) {
    const saved = localStorage.getItem('oc_access_hash');
    const hash = btoa(pin);
    if (!saved) localStorage.setItem('oc_access_hash', hash);
    if ((localStorage.getItem('oc_access_hash') || '') !== hash) return false;
    setState((s) => ({ ...s, auth: { isAuthenticated: true } }));
    return true;
  },
  navigate(route) {
    if (!routes.includes(route)) return;
    setState((s) => ({ ...s, ui: { ...s.ui, route, sidebarOpen: false } }));
  },
  toggleSidebar(force) {
    setState((s) => ({ ...s, ui: { ...s.ui, sidebarOpen: typeof force === 'boolean' ? force : !s.ui.sidebarOpen } }));
  },
  setWsStatus(wsStatus, wsUrl = '') {
    setState((s) => ({ ...s, connection: { wsStatus, wsUrl } }));
  },
  addTask(title) {
    if (!title.trim()) return;
    setState((s) => ({
      ...s,
      tasks: [{ id: crypto.randomUUID(), title: title.trim(), done: false, projectId: s.currentProjectId }, ...s.tasks],
    }));
  },
  toggleTask(id) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    }));
  },
  addUserMessage(text) {
    setState((s) => ({ ...s, messages: [...s.messages, { id: crypto.randomUUID(), role: 'user', text }] }));
  },
  addAiMessage(text) {
    setState((s) => ({ ...s, messages: [...s.messages, { id: crypto.randomUUID(), role: 'ai', text }] }));
  },
  setProject(id) {
    setState((s) => ({ ...s, currentProjectId: id }));
  },
};
