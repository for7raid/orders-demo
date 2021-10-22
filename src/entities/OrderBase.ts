import { Exclude, Expose, Type } from "class-transformer";
import { Client } from "./Client";
import { User } from "./User";

export class OrderBase {
    @Expose({ toPlainOnly: true })
    @Exclude({ toClassOnly: true })
    get __type() {
        return this.constructor.name;
    }

    id: number;
    user: User;
    date: number;
    changeDate: number = 0;

    name: string | undefined;

    @Type(() => Client)
    client: Client = new Client();

    @Type(() => Client)
    receiver: Client = new Client();

    description: string | undefined;

    constructor(user: User) {
        this.id = this.date = this.changeDate = (new Date()).getTime();
        this.user = user;
    }

    start(user: User) {
        throw new Error("not implemented");
    }

    dispatch(user: User) {
        throw new Error("not implemented");
    }

    cancel(user: User) {
        throw new Error("not implemented");
    }

    validate(): { isValid: boolean, message: string } {
        throw new Error("not implemented");
    }
}