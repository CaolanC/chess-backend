import Room from './ChessBackend/Room';
import RoomManager from './ChessBackend/RoomManager';
import Client from './ChessBackend/Client';
import { publicDir } from './constants';

import express, { Request, Response, Router, NextFunction } from "express";
import path from 'path';
import { Move, Square, SQUARES } from 'chess.js';

declare module 'express-serve-static-core' {
    interface Request {
        user?: Client;
        room?: Room;
    }
}

// all endpoints on the rooms route require you to be part of the room - todo bien
const rooms: Router = express.Router({mergeParams: true});
rooms.use(roomExists);
rooms.use(inRoom);

// adds req.room
export function roomExists(req: Request, res: Response, next: NextFunction): void {
    const room: Room | undefined = RoomManager.getRoom(req.params.room_id);
    if (!room) {
        res.status(404).send('Room not found');
        return;
    }
    req.room = room;
    next();
}

export function inRoom(req: Request, res: Response, next: NextFunction): void {
    if (!req.room!.hasPlayer(req.user!.Id)) {
        res.status(403).send("You're not part of this game");
        return;
    }
    next();
}

export function gameStarted(req: Request, res: Response, next: NextFunction): void {
    if (!req.room!.started()) {
        res.status(400).send("Game has not started");
        return;
    }
    next();
}

// reject requests after the game is done
export function gameNotFinished(req: Request, res: Response, next: NextFunction): void {
    if (req.room!.finished()) {
        res.status(400).send("Game has finished");
        return;
    }
    next();
}

export function usersTurn(req: Request, res: Response, next: NextFunction): void {
    const player = req.room!.toMove();
    if (!player.is(req.user!)) {
        res.status(400).send("Not your turn");
        return;
    }
    next();
}

rooms.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, 'game.html'));
});

rooms.get('/id', (req: Request, res: Response) => {
    res.send({id: req.room!.ID});
});

rooms.use(gameStarted); // all handlers past this point require the game to have started
rooms.post("*", gameNotFinished, usersTurn); // all POSTs require it to be the user's turn

rooms.get("/info", (req: Request, res: Response) => {
    const output = {
        color: req.room!.color(req.user!),
        opponent: req.room!.opponent(req.user!).Name || null
    };
    res.send(output);
});

rooms.get("/status", (req: Request, res: Response) => {
    res.send(req.room!.status());
});

rooms.get('/board', (req: Request, res: Response) => {
    const state = req.room!.boardState().map(a => a.map(p => p ? (p.color === 'w' ? p.type.toUpperCase() : p.type) : p))
    res.send(state);
});

rooms.get('/moves', (req: Request, res: Response) => {
    const square = req.query.square as Square;
    if (!square) {
        res.status(400).send("Provide ?square query");
        return;
    }

    if (!SQUARES.includes(square)) {
        res.status(400).send(`Invalid square '${square}'`);
        return;
    }

    const moves: Square[] = req.room!.getMoves(square);
    const array: boolean[][] = Array.from({ length: 8}, () => Array(8).fill(false));
    for (const coord of moves) {
        const y = coord.charCodeAt(0) - 'a'.charCodeAt(0);
        const x = Number.parseInt(coord[1]) - 1;
        array[x][y] = true;
    }
    res.send(array);
});

rooms.post('/move', (req: Request, res: Response) => {
    if (!(req.body.from && req.body.to)) {
        res.status(400).send("Malformed move");
        return;
    }

    const status: Move | null = req.room!.move(req.body as Move);
    if (status) {
        res.json(status);
    } else {
        res.status(400).send("Invalid move");
    }
});

export default rooms;