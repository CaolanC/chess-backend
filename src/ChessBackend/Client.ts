import { v4 as uuidv4 } from 'uuid';

export default class Client {
    public readonly Id: string;
    public Name?: string;

    constructor(id: string = uuidv4(), name?: string) {
        this.Id = id;
        this.Name = name;
    }

    // public name(): string | undefined {
    //     return this.Name;
    // }
}