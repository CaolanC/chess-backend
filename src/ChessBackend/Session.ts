import Player from './Player';

import { v4 as uuidv4 } from 'uuid';

export default class Session {
    public readonly ID: string;
    private readonly Players: Player[];

    private static readonly MAX_PLAYERS = 2;

    constructor() {
        this.ID = this._generateSessionId();
        this.Players = [];
    }

    public addPlayer(player: Player): boolean {
        if (!(this.isJoinable())) {
            return false;
        }
        this.Players.push(player);
        return true;
    }

    public hasPlayer(id: string): boolean {
        return this.Players.some(player => {
            return player.getID() === id;
        });
    }

    public isJoinable(): boolean {
        return this.Players.length < Session.MAX_PLAYERS;
    }

    public getID(): string {
        return this.ID;
    }

    private _generateSessionId(): string {
        return uuidv4();
    }
}