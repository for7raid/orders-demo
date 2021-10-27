import { createId } from "@/utils/uuid";
import { Expose, plainToClass, Type } from "class-transformer";
import { IValidationError } from "../IValidationError";
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
		return this.items.reduce((acc, cur) => { return acc + (cur.isCanceled ? 0 : cur.square * cur.count); }, 0);
	}

	constructor(id: string, index: number) {
		this.id = id;
		this.index = index;
	}

	cancel(user: User) {
		this.items.forEach(item => item.cancel(user));
	}

	removeItem(item: UVOrderObjectItem) {
		const index = this.items.indexOf(item);
		if (index > -1) {
			this.items.splice(index, 1);
		}
	}

	createItem(user: User, item: UVOrderObjectItem) {
		const allIndexes = this.items.map(o => o.index);
		const max = Math.max(0, ...allIndexes) + 1;
		const newRow = plainToClass(UVOrderObjectItem, { ...item }, { excludePrefixes: ['id', 'status', 'history'] });
		newRow.id = createId();
		newRow.index = max;
		newRow.added(user)
		return this.items.push(newRow);
	}

	validate(): IValidationError {
		const errors: IValidationError[] = [];
		if (!this.name || !this.name.toString().trim().length) {
			errors.push({name:'Укажите имя объекта'});
		}

		if (!this.items || !this.items.length) {
			errors.push({name: 'Добавьте макеты'});
		}

		this.items.forEach(item => {
			let state = item.validate();
			if (!state.isValid) {
				//errors.push(`<br/>-- ${this.index}.${item.index.toString().padStart(2, '0')} ${item.name || '[Без названия]'}<br/>` + state.message);
				errors.push(state);
			}
		});

		return {
			name: `${this.index}. ${this.name || '[Без названия]'}`,
			isValid: !errors.length,
			errors
		}
	}
}