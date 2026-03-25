import { createApp } from './app.js';
import { OpenClawSocket } from './services/openclaw.js';

const root = document.getElementById('app');
const wsClient = new OpenClawSocket();
wsClient.connect();

createApp(root, wsClient);
