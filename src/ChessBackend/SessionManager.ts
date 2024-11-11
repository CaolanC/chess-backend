import Session from "./Session";

export default class SessionManager {
    public Sessions: Map<string, Session>; // { [key: string]: Session };
    // private SecretKey: string; // TODO probably remove

    constructor(secret_key: string = "lol") {
        this.Sessions = new Map<string, Session>();
        // this.SecretKey = secret_key;
    }

    public addSession(new_session: Session): boolean {
        this.Sessions.set(new_session.getID(), new_session);
        return (this.Sessions.has(new_session.getID()));
    }

    public getSession(session_id: string): Session | undefined {
        return this.Sessions.get(session_id);
    }

    public sessionExists(session_id: string): boolean {
        return this.Sessions.has(session_id);
    }
}