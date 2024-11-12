export default class Client {
    public readonly Id: string;
    private Name?: string;

    constructor(id: string, name?: string) {
        this.Id = id;
        this.Name = name;
    }

    public name(): string | undefined {
        return this.Name;
    }
}