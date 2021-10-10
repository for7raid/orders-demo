import { User } from "../User";

export interface IUFOrderObjectItemHistoryItem {
    date: number;
    old: number;
    status: number;
    user: User;
}