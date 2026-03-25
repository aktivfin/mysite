import { useAppStore } from '../../state/store';

export function ProjectsPage() {
  const projects = useAppStore((s) => s.projects);

  return (
    <section>
      <h1>Projects</h1>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </section>
  );
}
