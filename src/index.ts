import Client from './ChessBackend/Client';
import Room from './ChessBackend/Room';

import { publicDir } from './constants';
import enforceSession from './session';
import Routes from './routes';
import rooms, { roomExists, roomManager } from './rooms';

import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';

const app = express();
app.use(cookieSession({
    secret: "totally_secret_key_use_in_prod",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}));
app.use(enforceSession);

app.get(Routes.HOME, (req: express.Request, res: express.Response) => { // The home-page
    res.sendFile(path.resolve(publicDir, 'index.html'));
});
app.use(express.static(publicDir));

app.use(Routes.ROOM + Routes.ROOM_ID, rooms);

// TODO make this POST probably
app.get(Routes.REGISTER, (req: express.Request, res: express.Response) => {
    req.session!.user.Name = req.params.username;
    res.send(`you did it mr. ${req.session!.user.Name}`)
})

app.post(Routes.CREATE, (req: express.Request, res: express.Response) => { // Endpoint creates a session
    const newRoom = new Room(req.user!);

    roomManager.addRoom(newRoom);
    res.redirect(`${Routes.ROOM}/${newRoom.ID}`);
});

// TODO this should be a POST
app.get(Routes.JOIN, roomExists, (req: express.Request, res: express.Response) => {
    const roomUrl = `${Routes.ROOM}/${req.room!.ID}`;
    const player: Client = req.session!.user;
    // if you're already in this game, we can just send you there
    if (req.room!.hasPlayer(player.Id)) {
        res.redirect(roomUrl);
        return;
    }

    if (req.room!.isJoinable()) {
        res.status(403).send('Session is full.');
        return;
    }

    req.room!.addPlayer(player);
    res.redirect(roomUrl);
});

app.listen(5299, () => {
    console.log('Server is running on port 5299');
});