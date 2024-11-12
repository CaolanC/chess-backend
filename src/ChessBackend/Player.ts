export default class Client {
    public readonly Id: string;
    public Name?: string;

    constructor(id: string, name?: string) {
        this.Id = id;
        this.Name = name;
    }

    // public name(): string | undefined {
    //     return this.Name;
    // }
}