import Client from './ChessBackend/Client';
import Room from './ChessBackend/Room';
import RoomManager from './ChessBackend/RoomManager';

import { publicDir } from './constants';
import enforceSession from './session';
import Routes from './routes';
import rooms, { roomExists } from './rooms';

import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';

const app = express();
app.use(cookieSession({
    secret: "totally_secret_key_use_in_prod",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}));
app.use(enforceSession);
app.use(express.json()); // read every POST as JSON

app.get(Routes.HOME, (req: express.Request, res: express.Response) => { // The home-page
    res.sendFile(path.resolve(publicDir, 'index.html'));
});
app.use(express.static(publicDir));

app.use(Routes.ROOM + Routes.ROOM_ID, rooms);

app.post(Routes.REGISTER, (req: express.Request, res: express.Response) => {
    if (req.body.username === undefined) {
        res.status(400).send("Missing username field");
        return;
    }

    if (typeof req.body.username !== 'string') {
        res.status(400).send("username must be string");
        return;
    }

    res.status(201);
    if (req.body.username) {
        req.user!.Name = req.body.username;
        res.send("Username set");
    } else {
        req.user!.Name = undefined;
        res.send("Username unset");
    }
})

app.get(Routes.NAME, (req: express.Request, res: express.Response) => {
    const output = { username: req.user!.Name || null };
    res.send(output);
});

app.post(Routes.CREATE, (req: express.Request, res: express.Response) => { // Endpoint creates a session
    const newRoom = new Room(req.user!);

    RoomManager.addRoom(newRoom);
    res.redirect(`${Routes.ROOM}/${newRoom.ID}`);
});

app.post(Routes.JOIN, roomExists, (req: express.Request, res: express.Response) => {
    const roomUrl = `${Routes.ROOM}/${req.room!.ID}`;
    const player: Client = req.user!;
    // if you're already in this game, we can just send you there
    if (req.room!.hasPlayer(player.Id)) {
        res.redirect(303, roomUrl);
        return;
    }

    if (req.room!.started()) {
        res.status(403).send('Room is full');
        return;
    }

    req.room!.addPlayer(player);
    res.redirect(303, roomUrl);
});

app.listen(5299, () => {
    console.log('Server is running on port 5299');
});