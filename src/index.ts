import Client from './ChessBackend/Client';
import Room from './ChessBackend/Room';
import RoomManager from './ChessBackend/RoomManager';

import { PUBLIC_DIR, SECRET_KEY } from './constants';
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

// TODO make this POST probably
app.get(Routes.REGISTER, (req: express.Request, res: express.Response) => {
    req.user!.Name = req.params.username;
    res.send(`you did it mr. ${req.user!.Name}`)
});

app.get(Routes.NAME, (req: express.Request, res: express.Response) => {
    const output = { username: req.user!.Name || null };
    res.send(output);
});

app.post(Routes.CREATE, (req: express.Request, res: express.Response) => { // Endpoint creates a session
    const newRoom = new Room(req.user!);

    RoomManager.addRoom(newRoom);
    res.redirect(`${Routes.ROOM}/${newRoom.ID}`);
});

// TODO this should be a POST
app.get(Routes.JOIN, roomExists, (req: express.Request, res: express.Response) => {
    const roomUrl = `${Routes.ROOM}/${req.room!.ID}`;
    const player: Client = req.user!;
    // if you're already in this game, we can just send you there
    if (req.room!.getPlayer(player.Id)) {
        res.redirect(roomUrl);
        return;
    }

    if (req.room!.started()) {
        res.status(403).send('Room is full.');
        return;
    }

    req.room!.start(player);
    req.room!.white().poke(); // TODO error handle
    res.redirect(roomUrl);
});

app.listen(5299, () => {
    console.log('Server is running on port 5299');
});