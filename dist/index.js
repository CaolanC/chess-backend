"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkManager_1 = require("./ChessBackend/NetworkManager");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookieParser = require('cookie-parser');
const app = (0, express_1.default)();
require('dotenv').config();
const MAX_PLAYERS = 2;
const projectRoot = path_1.default.resolve(__dirname);
const manager = new NetworkManager_1.ChessBackend.SessionManager();
StartApp();
function StartApp() {
    app.use(express_1.default.static(path_1.default.resolve(projectRoot, '..', 'public')));
    app.use(cookieParser());
    app.get('/', (req, res) => {
        res.sendFile(path_1.default.resolve(projectRoot, '..', 'public', 'index.html'));
    });
    app.post('/create-game', (req, res) => {
        const new_session = new NetworkManager_1.ChessBackend.Session();
        const game_url = new_session.getID();
        const player = new NetworkManager_1.ChessBackend.Player();
        new_session.addPlayer(player);
        manager.addSession(new_session);
        const player_id = player.getID();
        res.cookie('clientInfo', { player_id, game_url }, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.redirect(`/game/${game_url}`);
    });
    // Fixing the route handler by letting Express infer types for req and res
    app.get('/game/:game_url', (req, res) => {
        const { clientInfo } = req.cookies;
        const url = req.params.game_url;
        if (!(manager.urlExists(url))) {
            return res.status(404).send('Session not found.');
        }
        const session = manager.getSession(url);
        if (!session) {
            return res.status(404).send('Session not found.');
        }
        if (clientInfo && clientInfo.player_id) { // If it's the host / someone who has already joined.
            const playerExists = session.hasPlayer(clientInfo.player_id);
            if (playerExists) {
                return res.sendFile(path_1.default.join(projectRoot, '..', 'public', 'game.html'));
            }
        }
        if (!session.isJoinable()) {
            return res.status(403).send('Session is full.');
        }
        const player = new NetworkManager_1.ChessBackend.Player();
        session.addPlayer(player);
        const player_id = player.getID();
        res.cookie('clientInfo', { player_id, url }, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.sendFile(path_1.default.join(projectRoot, '..', 'public', 'game.html'));
    });
    app.listen(5299, () => {
        console.log('Server is running on port 5299');
    });
}
