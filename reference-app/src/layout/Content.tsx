import { useMemo } from 'react';
import { useAppStore } from '../state/store';
import { ChatPage } from '../modules/chat/ChatPage';
import { ProjectsPage } from '../modules/projects/ProjectsPage';

export function Content() {
  const route = useAppStore((s) => s.route);

  const node = useMemo(() => {
    if (route === 'chat') return <ChatPage />;
    if (route === 'projects') return <ProjectsPage />;
    return <div>Раздел {route} в разработке</div>;
  }, [route]);

  return <main>{node}</main>;
}
