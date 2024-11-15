import Room from "./Room";

const CLEAR_INTERVAL = 1 * (60 * 60 * 1000); // 1 hour

export default class RoomManager {
    private static readonly Rooms: Map<string, Room> = new Map<string, Room>();
    private static readonly Cleaner = setInterval(() => {
            for (const [id, room] of this.Rooms) {
                if (new Date() > room.expiration()) {
                    this.Rooms.delete(id);
                }
            }
    }, CLEAR_INTERVAL);

    public static addRoom(new_session: Room): boolean {
        this.Rooms.set(new_session.ID, new_session);
        return (this.Rooms.has(new_session.ID));
    }

    public static getRoom(session_id: string): Room | undefined {
        return this.Rooms.get(session_id);
    }

    public static roomExists(session_id: string): boolean {
        return this.Rooms.has(session_id);
    }
}