import Session from "./Session";

export default class SessionManager {
    public Sessions: { [key: string]: Session };
    private SecretKey: string; // TODO probably remove

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