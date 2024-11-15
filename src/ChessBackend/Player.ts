import Client from "./Client";
import Messenger from "./Messenger";

import { Color } from "chess.js";

export default class Player {
    public readonly Client: Client;
    public readonly Color: Color;
    public Stream?: Messenger;

    constructor(client: Client, color: Color) {
        this.Client = client;
        this.Color = color;
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