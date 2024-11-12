import Client from './Client';
import { Chess } from 'chess.js';

import { v4 as uuidv4 } from 'uuid';

type Chessboard = Chess;

export default class Room {
    public readonly ID: string = uuidv4();
    private readonly Players: [Client, Client?];
    private readonly Board: Chessboard = new Chess();

    constructor(host: Client) {
        this.Players = [host];
    }

    public addPlayer(player: Client): boolean {
        if (!(this.isJoinable())) return false;
        this.Players[1] = player;
        return true;
    }

    public hasPlayer(id: string): boolean {
        return this.Players.some(player => {
            return player?.Id === id;
        });
    }

    public isJoinable(): boolean {
        return this.black() === undefined; // black player isn't here yet
    }

    public white(): Client {
        return this.Players[0];
    }

    public black(): Client | undefined {
        return this.Players[1];
    }
}