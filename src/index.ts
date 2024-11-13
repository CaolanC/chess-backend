import Client from './ChessBackend/Client';
import Room from './ChessBackend/Room';
import RoomManager from './ChessBackend/RoomManager';

import { publicDir } from './constants';
import validateSession from './ChessBackend/Session';
import Routes from './routes';

import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';

const publicDir = path.resolve(__dirname, "..", "public");
const manager = new RoomManager();

const app = express();
app.use(cookieSession({
    secret: "totally_secret_key_use_in_prod",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}));
app.use(validateSession);

app.get(Routes.HOME, (req: express.Request, res: express.Response) => { // The home-page
    res.sendFile(path.resolve(publicDir, 'index.html'));
});
app.use(express.static(publicDir));

// TODO make this POST probably
app.get(Routes.REGISTER, (req: express.Request, res: express.Response) => {
    req.session!.user.Name = req.params.username;
    res.send(`you did it mr. ${req.session!.user.Name}`)
})

app.post(Routes.CREATE, (req, res) => { // Endpoint creates a session
    const host = req.session!.user;
    const new_session = new Room(host);

    manager.addRoom(new_session);
    res.redirect(`/room/${new_session.ID}`);
});

// TODO this should be a POST
app.get(Routes.JOIN, (req: express.Request, res: express.Response) => {
    const room = manager.getRoom(req.params.room_id);
    if (!room) {
        res.status(404).send('Room not found.');
        return;
    }

    const player: Client = req.session!.user;
    // if you're already in this game, we can just send you there
    if (room.hasPlayer(player.Id)) {
        res.redirect(`/room/${room.ID}`); // HACK dont like hardcoding this
        return;
    }

    if (!room.isJoinable()) {
        res.status(403).send('Session is full.');
        return;
    }

    room.addPlayer(player);
    res.redirect(`/room/${room.ID}`);
});

app.get(Routes.ROOM, (req: express.Request, res: express.Response) => { // Joining a generated session
    const room = manager.getRoom(req.params.room_id);

    if (room === undefined) {
        res.status(404).send('Session not found.');
        return;
    }

    const player: Client = req.session!.user;
    if (!room.hasPlayer(player.Id)) {
        res.status(403).send("You're not part of this game");
        return;
    }

    res.sendFile(path.join(publicDir, 'game.html'));
});

app.listen(5299, () => {
    console.log('Server is running on port 5299');
});