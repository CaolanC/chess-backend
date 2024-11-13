import Room from './ChessBackend/Room';
import RoomManager from './ChessBackend/RoomManager';
import Client from './ChessBackend/Client';
import { publicDir } from './constants';

import express, { Request, Response, Router, NextFunction } from "express";
import path from 'path';

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
});

export default rooms;