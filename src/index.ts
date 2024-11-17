import Client from './ChessBackend/Client';
import Room from './ChessBackend/Room';
import RoomManager from './ChessBackend/RoomManager';

import { PUBLIC_DIR, SECRET_KEY, PORT } from './constants';
import enforceSession from './session';
import Routes from './routes';
import rooms, { roomExists } from './rooms';

import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';

const app = express();
app.use(cookieSession({
    secret: SECRET_KEY,
    maxAge: 7 * 24 * 60 * 60 * 1000, // session lasts a week
}));
app.use(enforceSession);
app.use(express.json()); // read every POST as JSON

app.get(Routes.HOME, (req: express.Request, res: express.Response) => { // The home-page
    res.sendFile(path.resolve(PUBLIC_DIR, 'index.html'));
});
app.use(express.static(PUBLIC_DIR));

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
    if (req.room!.getPlayer(player.Id)) {
        res.redirect(303, roomUrl);
        return;
    }

    if (req.room!.started()) {
        res.status(403).send('Room is full');
        return;
    }

    req.room!.start(player);
    req.room!.white().poke(); // TODO error handle
    res.redirect(303, roomUrl);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});