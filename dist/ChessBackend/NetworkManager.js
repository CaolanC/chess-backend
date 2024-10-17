"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessBackend = void 0;
const uuid_1 = require("uuid");
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = (0, express_1.default)();
const MAX_PLAYERS = 2;
var ChessBackend;
(function (ChessBackend) {
    class Player {
        constructor(name = "Guest") {
            this.Name = name;
            this.ClientID = (0, uuid_1.v4)();
        }
        getID() {
            return this.ClientID;
        }
    }
    ChessBackend.Player = Player;
    class Session {
        constructor() {
            this.ID = this._generateSessionId();
            this.Engine_Manager = new EngineManager();
            this.Players = [];
        }
        addPlayer(player) {
            if (!(this.isJoinable())) {
                return false;
            }
            this.Players.push(player);
            return true;
        }
        hasPlayer(id) {
            return this.Players.some(player => {
                return player.getID() === id;
            });
        }
        isJoinable() {
            return this.Players.length < MAX_PLAYERS;
        }
        getID() {
            return this.ID;
        }
        _generateSessionId() {
            return (0, uuid_1.v4)();
        }
    }
    ChessBackend.Session = Session;
    class EngineManager {
        constructor() { }
    }
    class SessionManager {
        constructor(secret_key = "lol") {
            this.Sessions = {};
            this.SecretKey = secret_key;
        }
        addSession(new_session) {
            this.Sessions[new_session.getID()] = new_session;
            if (new_session.getID() in this.Sessions) {
                return false;
            }
            return true;
        }
        getSession(session_id) {
            if (session_id in this.Sessions) {
                return this.Sessions[session_id];
            }
            return undefined;
        }
        urlExists(url) {
            const keys = Object.keys(this.Sessions);
            return keys.includes(url);
        }
    }
    ChessBackend.SessionManager = SessionManager;
})(ChessBackend || (exports.ChessBackend = ChessBackend = {}));
