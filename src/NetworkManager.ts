import { v4 as uuidv4 } from 'uuid';

namespace ChessBackend
{

    class Player
    {
    }

    class Session
    {

        public readonly id: string;
        private readonly engine_manager;
        private readonly players: Player[];

        constructor() {
            this.id = this._generateSessionId();
            this.engine_manager = new EngineManager();
            this.players = [];
        }

        private _generateSessionId(): string {
            return uuidv4();
        }

        private _generateSessionCode(): string {

        }
    }

    class EngineManager
    {
        constructor() {
            
        }
    }

    class SessionManager
    {
        public readonly sessions: Session[];

        SessionManager() {
            this.sessions = [];
        }
    }
}
