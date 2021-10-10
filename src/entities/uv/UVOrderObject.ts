import { Expose, Type } from "class-transformer";
import { User } from "../User";
import { UVOrderObjectItem } from "./UVOrderObjectItem";

export class UVOrderObject {
	id: string;
	name: string | undefined;
	index = 1;

	@Type(() => UVOrderObjectItem)
	items: UVOrderObjectItem[] = [];

	@Expose()
	get total() {
		return this.items.reduce((acc, cur) => { return acc + (cur.isCanceled ? 0 : cur.total); }, 0);
	}

	get totalCount() {
		return this.items.reduce((acc, cur) => { return acc + (cur.isCanceled ? 0 : cur.count); }, 0);
	}

	get totalSquare() {
		return this.items.reduce((acc, cur) => { return acc + (cur.isCanceled ? 0 : cur.square *  cur.count); }, 0);
	}

	constructor(id: string, index: number) {
		this.id = id;
		this.index = index;
	}

	cancel(user: User) {
		this.items.forEach(item => item.cancel(user));
	}

	validate() {
		const errors = [];
		if (!this.name || !this.name.toString().trim().length) {
			errors.push('-Укажите имя объекта');
		}

		if (!this.items || !this.items.length) {
			errors.push('-Добавьте макеты');
		}

		this.items.forEach(item => {
			let state = item.validate();
			if (!state.isValid) {
				errors.push(`<br/>-- ${this.index}.${item.index.toString().padStart(2, '0')} ${item.name || '[Без названия]'}<br/>` + state.message);
			}
		});

		return {
			isValid: !errors.length,
			message: errors.join('<br/>')
		}
	}
}