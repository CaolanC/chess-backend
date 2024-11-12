import Client from './ChessBackend/Client';
import Room from './ChessBackend/Room';
import SessionManager from './ChessBackend/SessionManager';

import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';

import { v4 as uuidv4 } from 'uuid';

const projectRoot = path.resolve(__dirname);
const manager = new SessionManager();

const app = express();
app.use(cookieSession({
    secret: "totally_secret_key_use_in_prod",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}));

app.get('/', (req: express.Request, res: express.Response) => { // The home-page
    // if the client has no ID, give them one
    if (!req.session) {
        res.status(500).send("No session?");
        return;
    }

    if (!req.session.user) {
        req.session.user = new Client(uuidv4());
    }

    res.sendFile(path.resolve(projectRoot, '..', 'public', 'index.html'));
});

// TODO make this POST probably
app.get('/register/:username', (req: express.Request, res: express.Response) => {
    if (!req.session?.user) {
        res.redirect("/");
        return;
    }

    req.session.user.Name = req.params.username;
    res.send(`you did it mr. ${req.session.user.Name}`)
})

app.post('/create-game', (req, res) => { // Endpoint creates a session
    if (!req.session?.user) {
        res.redirect("/");
        return;
    }

    const host = req.session.user;
    const new_session = new Room(host);
    // const game_url = new_session.getID();

    manager.addSession(new_session);

    res.redirect(`/game/${new_session.ID}`);
});

app.get('/game/:game_url', (req: express.Request, res: express.Response): void => { // Joining a generated session
    if (!req.session?.user) {
        res.redirect("/");
        return;
    }

    const sessionId = req.params.game_url;
    const session = manager.getSession(sessionId);

    if (session === undefined) {
        res.status(404).send('Session not found.');
        return;
    }

    const player: Client = req.session.user;
    if (session.hasPlayer(player.Id)) { // If it's the host / someone who has already joined.
        res.sendFile(path.join(projectRoot, '..', 'public', 'game.html'));
        return;
    }

    if (!session.isJoinable()) {
        res.status(403).send('Session is full.');
        return;
    }

    session.addPlayer(player);

    res.sendFile(path.join(projectRoot, '..', 'public', 'game.html'));
});

app.listen(5299, () => {
    console.log('Server is running on port 5299');
});