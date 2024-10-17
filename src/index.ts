import { ChessBackend } from './ChessBackend/NetworkManager';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import path from 'path';
const cookieParser = require('cookie-parser');
const app = express();

require('dotenv').config();

const MAX_PLAYERS = 2;

const projectRoot = path.resolve(__dirname);

const manager = new ChessBackend.SessionManager();

StartApp();

function StartApp(): void {
    app.use(express.static(path.resolve(projectRoot, '..', 'public')));
    app.use(cookieParser());

    app.get('/', (req, res) => {
        res.sendFile(path.resolve(projectRoot, '..', 'public', 'index.html'));
    });

    app.post('/create-game', (req, res) => {
        const new_session = new ChessBackend.Session();
        const game_url = new_session.getID();
        const player = new ChessBackend.Player();
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
    app.get('/game/:game_url', (req: any, res: any) => {
        const { clientInfo } = req.cookies;
        const url = req.params.game_url;

        if (!(manager.urlExists(url))) {
            return res.status(404).send('Session not found.');
        }

        const session = manager.getSession(url);

        if (!session) {
            return res.status(404).send('Session not found.');
        }

        if (clientInfo && clientInfo.player_id) {
            const playerExists = session.hasPlayer(clientInfo.player_id);
            if (playerExists) {
                return res.sendFile(path.join(projectRoot, '..', 'public', 'game.html'));
            }
        }

        if (!session.isJoinable()) {
            return res.status(403).send('Session is full.');
        }

        const player = new ChessBackend.Player();
        session.addPlayer(player);
        const player_id = player.getID();
        res.cookie('clientInfo', { player_id, url }, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.sendFile(path.join(projectRoot, '..', 'public', 'game.html'));
        });

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

