import Client from './Client';
import Player from './Player';
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
    private readonly Players: [Player, Player?]
    private Board?: Chessboard; // construction is deferred until the game starts
    private readonly Expiration: Date = new Date(Date.now() + LIFETIME);

    constructor(host: Client) {
        this.Players = [new Player(host, 'w')];
    }

    public expiration(): Date {
        return this.Expiration;
    }

    public start(player: Client): boolean {
        if (this.started()) return false;
        this.Players[1] = new Player(player, 'b');
        this.Board = new Chess();
        return true;
    }

    public getPlayer(id: string): Player | undefined {
        return this.Players.find(player => player?.Client.Id === id);
    }

    public started(): boolean {
        return this.Board !== undefined;
    }

    public finished(): boolean {
        return this.Board!.isGameOver();
    }

    public white(): Player {
        return this.Players[0];
    }

    public black(): Player {
        return this.Players[1]!;
    }

    // return the opposing player
    public opponent(player: Client): Player {
        if (!this.getPlayer(player.Id)) throw new Error(PLAYER_MESSAGE);
        return this.Players.find(p => !player.is(p!.Client))!;
    }

    public toMove(): Player {
        const turn: Color = this.Board!.turn();
        return this.Players.find(player => (player?.Color === turn))!;
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