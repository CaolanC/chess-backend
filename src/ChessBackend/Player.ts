import { v4 as uuidv4 } from 'uuid';

export default class Player {
    public readonly Name: string;
    private readonly ClientID: string;

    constructor(name: string = "Guest") {
        this.Name = name;
        this.ClientID = uuidv4();
    }

    public getID() {
        return this.ClientID;
    }
}