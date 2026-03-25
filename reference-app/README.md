# Reference App

Минимальный каркас новой архитектуры:
- `state/store.ts` — единый state-слой.
- `services/openclaw.ts` — транспортный адаптер OpenClaw.
- `layout/*` — shell-компоненты.
- `modules/*` — доменные экраны.

Запуск (пример):
1. `npm create vite@latest reference-app -- --template react-ts`
2. заменить `src` файлами из этой папки
3. `npm install zustand`
4. `npm run dev`
