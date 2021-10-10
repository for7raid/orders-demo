import { User } from "@/entities/User";

import { getAuth } from "firebase/auth";

export class UserProvider {
    get currentUser(): User {
        const current = getAuth().currentUser;
        if (current) {
            return new User(current!.uid, current!.displayName || current!.email || 'Anonymous');
        }
        return new User('Anonymous','Anonymous');
    }
}