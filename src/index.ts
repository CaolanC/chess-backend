import { ChessBackend } from './ChessBackend/NetworkManager';

const manager = new ChessBackend.SessionManager();

manager.start();
