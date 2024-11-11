import Player from './Player';

import { v4 as uuidv4 } from 'uuid';

export default class Session {
    public readonly ID: string = uuidv4();
    private readonly Players: [Player, Player?];

    constructor(host: Player) {
        this.Players = [host];
    }

    public addPlayer(player: Player): boolean {
        if (!(this.isJoinable())) return false;
        this.Players[1] = player;
        return true;
    }

    public hasPlayer(id: string): boolean {
        return this.Players.some(player => {
            return player?.ClientID === id;
        });
    }

    public isJoinable(): boolean {
        return this.black() === undefined; // black player isn't here yet
    }

    public white(): Player {
        return this.Players[0];
    }

    public black(): Player | undefined {
        return this.Players[1];
    }
}