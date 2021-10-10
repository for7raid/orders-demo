export class User {
    id: string | undefined;
    name: string | undefined;

    constructor(id?: string, name?: string){
        this.id = id;
        this.name = name;
    }
}