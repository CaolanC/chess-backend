import { Response } from "express";

const headers = {
    "Content-Type": 'text/event-stream',
    "Cache-Control": 'no-cache',
    "Connection": 'keep-alive'
};

export default class Messenger {
    private stream?: Response;
    constructor(res: Response) {
        this.stream = res;
        for (const [header, value] of Object.entries(headers)) {
            this.stream.setHeader(header, value);
        }
        this.stream.flushHeaders();
        this.stream.once('close', () => this.stream = undefined);
    }

    public valid(): boolean {
        return !!this.stream;
    }

    public send(body: string): boolean {
        return this.stream!.write(`data: ${body}\n\n`);
    }
}