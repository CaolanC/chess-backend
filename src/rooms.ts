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

export const roomManager = new RoomManager();
// all endpoints on the rooms route require you to be part of the room - todo bien
const rooms: Router = express.Router({mergeParams: true});
rooms.use(roomExists);
rooms.use(inRoom);

// adds req.room
export function roomExists(req: Request, res: Response, next: NextFunction): void {
    const room: Room | undefined = roomManager.getRoom(req.params.room_id);
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

rooms.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, 'game.html'));
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
    res.send(moves);
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