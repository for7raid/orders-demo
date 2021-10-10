import { User } from "@/entities/User";

import { getAuth, onAuthStateChanged as onAuthStateChangedF } from "firebase/auth";

export class UserService {
    get currentUser(): User {
        const current = getAuth().currentUser;
        if (current) {
            return new User(current!.uid, current!.displayName || current!.email || 'Anonymous');
        }
        return new User('Anonymous', 'Anonymous');
    }


}