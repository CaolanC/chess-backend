import Messenger from './Messenger';

import { v4 as uuidv4 } from 'uuid';

export default class Client {
    public readonly Id: string;
    public Name?: string;
    private Stream?: Messenger;

    constructor(id: string = uuidv4(), name?: string) {
        this.Id = id;
        this.Name = name;
    }

    public static named(name: string): Client {
        return new Client(uuidv4(), name);
    }

    // create a clone of a client (or client-like JSON object)
    public static copy(other: Client): Client {
        return new Client(other.Id, other.Name);
    }

    public is(other: Client): boolean {
        return this.Id == other.Id;
    }

    public setStream(stream: Messenger): void {
        this.Stream = stream;
    }

    public clearStream(): void {
        this.Stream = undefined;
    }

    public poke(): boolean {
        if (!this.Stream?.valid()) return false;
        return this.Stream.send("");
    }
}