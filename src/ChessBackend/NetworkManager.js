"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessBackend = void 0;
const uuid_1 = require("uuid");
const express_1 = __importDefault(require("express")); // Import Request and Response
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
var ChessBackend;
(function (ChessBackend) {
    class Player {
    }
    class Session {
        constructor() {
            this.ID = this._generateSessionId();
            this.Engine_Manager = new EngineManager();
            this.Players = [];
        }
        getUrl() {
            const game_url = `/game/${this.ID}`;
            return game_url;
        }
        getID() {
            return this.ID;
        }
        _generateSessionId() {
            return (0, uuid_1.v4)();
        }
    }
    class EngineManager {
        constructor() {
        }
    }
    class SessionManager {
        constructor() {
            this.Sessions = [];
        }
        start() {
            app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'front', 'public')));
            app.get('/', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '..', '..', 'front', 'public', 'index.html'));
            });
            app.post('/create-game', (req, res) => {
                const new_session = new Session();
                this.Sessions.push(new_session);
                const game_url = new_session.getUrl();
                console.log(game_url);
                res.redirect(game_url);
            });
            app.get('/game/:game_url', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '..', '..', 'front', 'public', 'index.html'));
            });
            app.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        }
    }
    ChessBackend.SessionManager = SessionManager;
})(ChessBackend || (exports.ChessBackend = ChessBackend = {}));
