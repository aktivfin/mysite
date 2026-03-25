import { create } from 'zustand';

export type AppRoute = 'dashboard' | 'chat' | 'projects' | 'tasks' | 'habits' | 'finances';

export interface Project {
  id: string;
  name: string;
  kind: 'youtube' | 'music' | 'book' | 'business' | 'personal';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  threadId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

interface AppState {
  route: AppRoute;
  sidebarOpen: boolean;
  wsStatus: 'disconnected' | 'connecting' | 'connected';
  currentProjectId: string | null;
  projects: Project[];
  tasks: Task[];
  messages: Message[];

  navigate: (route: AppRoute) => void;
  toggleSidebar: (open?: boolean) => void;
  setWsStatus: (status: AppState['wsStatus']) => void;
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setCurrentProject: (id: string) => void;
  addMessage: (message: Message) => void;
}

export const useAppStore = create<AppState>((set) => ({
  route: 'dashboard',
  sidebarOpen: false,
  wsStatus: 'disconnected',
  currentProjectId: null,
  projects: [],
  tasks: [],
  messages: [],

  navigate: (route) => set({ route }),
  toggleSidebar: (open) => set((s) => ({ sidebarOpen: typeof open === 'boolean' ? open : !s.sidebarOpen })),
  setWsStatus: (wsStatus) => set({ wsStatus }),
  setProjects: (projects) =>
    set((state) => ({
      projects,
      currentProjectId: state.currentProjectId ?? projects[0]?.id ?? null,
    })),
  setTasks: (tasks) => set({ tasks }),
  setCurrentProject: (id) => set({ currentProjectId: id }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
}));
