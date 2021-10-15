import { User } from "@/entities/User";

import { getAuth, GoogleAuthProvider, onAuthStateChanged as onAuthStateChangedF, signInWithPopup } from "firebase/auth";

export class UserService {

    get currentUser(): User {
        const current = getAuth().currentUser;
        if (current) {
            return new User(current!.uid, current!.displayName || current!.email || 'Anonymous');
        }
        return new User('Anonymous', 'Anonymous');
    }

    onAuthStateChanged(callback: (user: User) => void) {
        getAuth().onAuthStateChanged(user => {
            if (user) {
                callback(new User(user!.uid, user!.displayName || user!.email || 'Anonymous', user.isAnonymous));
            }
            else {
                callback(new User('Anonymous', 'Anonymous', true));
            }
        })
    }

    async signOut() {
        await getAuth().signOut();
    }

    async signIn() {
        signInWithPopup(getAuth(), new GoogleAuthProvider());
    }

}