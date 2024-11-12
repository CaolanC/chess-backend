import Room from "./Room";

export default class SessionManager {
    public Rooms: Map<string, Room>; // { [key: string]: Session };
    // private SecretKey: string; // TODO probably remove

    constructor(secret_key: string = "lol") {
        this.Rooms = new Map<string, Room>();
        // this.SecretKey = secret_key;
    }

    public addRoom(new_session: Room): boolean {
        this.Rooms.set(new_session.ID, new_session);
        return (this.Rooms.has(new_session.ID));
    }

    public getRoom(session_id: string): Room | undefined {
        return this.Rooms.get(session_id);
    }

    public roomExists(session_id: string): boolean {
        return this.Rooms.has(session_id);
    }
}