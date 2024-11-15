import Room from "./Room";

export default class RoomManager {
    private Rooms: Map<string, Room> = new Map<string, Room>();

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