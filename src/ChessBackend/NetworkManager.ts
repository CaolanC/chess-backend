import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import path from 'path';

require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();

const MAX_PLAYERS = 2;

export namespace ChessBackend {
    export class Player {
        public readonly Name: string;
        private readonly ClientID: string;

        constructor(name: string = "Guest") {
            this.Name = name;
            this.ClientID = uuidv4();
        }

        public getID() {
            return this.ClientID;
        }
    }

    export class Session {
        public readonly ID: string;
        private readonly Engine_Manager: EngineManager;
        private readonly Players: Player[];

        constructor() {
            this.ID = this._generateSessionId();
            this.Engine_Manager = new EngineManager();
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
            return this.Players.length < MAX_PLAYERS;
        }

        public getID(): string {
            return this.ID;
        }

        private _generateSessionId(): string {
            return uuidv4();
        }
    }

    class EngineManager {
        constructor() { }
    }

    export class SessionManager {
        public Sessions: { [key: string]: Session };
        private SecretKey: string;

        constructor(secret_key: string = "lol") {
            this.Sessions = {};
            this.SecretKey = secret_key;
        }

        public addSession(new_session: Session): boolean {
            this.Sessions[new_session.getID()] = new_session;
            if (new_session.getID() in this.Sessions) {
                return false;
            }
            return true;
        }

        public getSession(session_id: string): Session | undefined {
            if (session_id in this.Sessions) {
                return this.Sessions[session_id];
            }

            return undefined;
        }

        public urlExists(url: string): boolean {
            const keys = Object.keys(this.Sessions);
            return keys.includes(url);
        }
    }
}

