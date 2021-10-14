import { Exclude, Expose } from "class-transformer";
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

    client: string | undefined;
    clientAddress: string | undefined;
    clientContacts: string | undefined;

    receiver: string | undefined;
    receiverAddress: string | undefined;
    receiverContacts: string | undefined;

    description: string | undefined;

    constructor(user: User) {
        this.id = this.date = this.changeDate = (new Date()).getTime();
        this.user = user;
    }

    validate(): { isValid: boolean, message: string } {
        throw new Error("not implemented");
    }
}