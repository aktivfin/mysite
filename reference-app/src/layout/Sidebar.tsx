import { useAppStore, type AppRoute } from '../state/store';

const ROUTES: { id: AppRoute; label: string }[] = [
  { id: 'dashboard', label: 'Today' },
  { id: 'chat', label: 'Chat' },
  { id: 'projects', label: 'Projects' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'habits', label: 'Habits' },
  { id: 'finances', label: 'Finances' },
];

export function Sidebar() {
  const route = useAppStore((s) => s.route);
  const navigate = useAppStore((s) => s.navigate);
  const wsStatus = useAppStore((s) => s.wsStatus);

  return (
    <aside>
      <h2>OpenClaw OS</h2>
      <p>WS: {wsStatus}</p>
      <nav>
        {ROUTES.map((item) => (
          <button key={item.id} onClick={() => navigate(item.id)} aria-current={route === item.id}>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
