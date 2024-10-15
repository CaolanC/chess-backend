"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
var ChessBackend;
(function (ChessBackend) {
    class Player {
    }
    class Session {
        constructor() {
            this.id = this._generateSessionId();
            this.engine_manager = new EngineManager();
            this.players = [];
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
        SessionManager() {
            this.sessions = [];
        }
    }
})(ChessBackend || (ChessBackend = {}));
