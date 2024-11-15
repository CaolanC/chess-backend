import Client from './Client';
import { Chess, Piece, Square, Move, Color } from 'chess.js';

import { v4 as uuidv4 } from 'uuid';

type Chessboard = Chess;

const PLAYER_MESSAGE = "Player not in game";
const LIFETIME = 1 * (60 * 60 * 1000); // 1 hour

interface GameStatus {
    turn: {
        color: Color;
        check: boolean;
    };
    winner?: Color | '-';
}

export default class Room {
    public readonly ID: string = uuidv4().slice(0, 8);
    private readonly Players: [Client, Client?];
    private Board?: Chessboard; // construction is deferred until the game starts
    private readonly Expiration: Date = new Date(Date.now() + LIFETIME);

    constructor(host: Client) {
        this.Players = [host];
    }

    public expiration(): Date {
        return this.Expiration;
    }

    public start(player: Client): boolean {
        if (this.started()) return false;
        this.Players[1] = player;
        this.Board = new Chess();
        return true;
    }

    public hasPlayer(id: string): boolean {
        return this.Players.some(player => {
            return player?.Id === id;
        });
    }

    public started(): boolean {
        return this.Board !== undefined;
    }

    public finished(): boolean {
        return this.Board!.isGameOver();
    }

    public white(): Client {
        return this.Players[0];
    }

    public black(): Client {
        return this.Players[1]!;
    }

    // return a player's color
    public color(player: Client): Color {
        if (!this.hasPlayer(player.Id)) throw new Error(PLAYER_MESSAGE);
        return player.is(this.white()) ? "w" : "b";
    }

    // return the opposing player
    public opponent(player: Client): Client {
        if (!this.hasPlayer(player.Id)) throw new Error(PLAYER_MESSAGE);
        return player.is(this.white()) ? this.black() : this.white();
    }

    public toMove(): Client {
        return (this.Board!.turn() === 'w') ? this.white() : this.black()!;
    }

    public getMoves(coord: Square): Square[] {
        return this.Board!.moves({square: coord, verbose: true}).map(e => e.to);
    }

    public move(move: Move): Move | null {
        try {
            return this.Board!.move(move);
        } catch (e: unknown) {
            return null;
        }
    }

    public boardState(): (Piece | null)[][] {
        return this.Board!.board().reverse().map(a => a.map(e => e ? {type: e.type, color: e.color} : null));
    }

    public status(): GameStatus {
        let result: GameStatus = {
            turn: {
                color: this.Board!.turn(),
                check: this.Board!.inCheck()
            },
        };
        if (this.Board!.isGameOver()) {
            if (this.Board!.isCheckmate()) {
                result.winner = (this.Board!.turn() === 'w') ? 'b' : 'w';
            } else {
                result.winner = '-';
            }
        }
        return result;
    }
}