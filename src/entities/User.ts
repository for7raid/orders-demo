import { Exclude } from "class-transformer";

export class User {
    id: string | undefined;
    name: string | undefined;
    @Exclude()
    isAnonymous?: boolean;

    constructor(id?: string, name?: string, isAnonymous?: boolean){
        this.id = id;
        this.name = name;
        this.isAnonymous = isAnonymous;
    }
}