import Room from "./Room";

export default class SessionManager {
    public Sessions: Map<string, Room>; // { [key: string]: Session };
    // private SecretKey: string; // TODO probably remove

    constructor(secret_key: string = "lol") {
        this.Sessions = new Map<string, Room>();
        // this.SecretKey = secret_key;
    }

    public addSession(new_session: Room): boolean {
        this.Sessions.set(new_session.ID, new_session);
        return (this.Sessions.has(new_session.ID));
    }

    public getSession(session_id: string): Room | undefined {
        return this.Sessions.get(session_id);
    }

    public sessionExists(session_id: string): boolean {
        return this.Sessions.has(session_id);
    }
}