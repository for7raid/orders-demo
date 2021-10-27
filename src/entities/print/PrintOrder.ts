import { createId } from "@/utils/uuid";
import { Expose, Type } from "class-transformer";
import { IValidationError } from "../IValidationError";
import { OrderBase } from "../OrderBase";
import { User } from "../User";
import { PrintOrderItem } from "./PrintOrderItem";

export class PrintOrder extends OrderBase {

	@Type(() => PrintOrderItem)
	items: PrintOrderItem[] = [];

	@Expose()
	get statuses() {
		const allStatues: number[] = [];

		this.items.forEach(item => {
			if (allStatues.indexOf(item.status) < 0) {
				allStatues.push(item.status);
			}
		})

		allStatues.sort((a, b) => a - b);
		return allStatues;
	}
	@Expose()
	get status() {
		let s = 100;

		this.items.forEach(item => {
			s = Math.min(s, item.status);
		})

		return s;
	}

	@Expose()
	get total() {
		let total = 0;
		this.items.forEach(item => {
			if (!item.isCanceled) {
				total += item.total;
			}
		})

		return total;
	}

	createItem(user: User) {
		const allIndexes = this.items.map(o => o.index);
		const max = Math.max(0, ...allIndexes) + 1;
		const item = new PrintOrderItem(createId(), max);
		item.added(user);
		return this.items.push(item);
	}

	start(user: User) {
		this.items.forEach(item => {
			if (item.canStart) {
				item.start(user);
			}
		})
	}

	dispatch(user: User) {
		this.items.forEach(item => {
			if (item.canDispatch) {
				item.dispatch(user);
			}
		})
	}

	cancel(user: User) {
		this.items.forEach(item => {
			item.cancel(user);
		})
	}

	validate(): IValidationError {
		const errors: IValidationError[] = [];
		if (!this.name || !this.name.toString().trim().length) {
			errors.push({ name: 'Укажите имя заказа' });
		}

		if (!this.client || !this.client.toString().trim().length) {
			errors.push({ name: 'Укажите клиента заказа' });
		}

		if (!this.items || !this.items.length) {
			errors.push({ name: 'Добавьте макеты' });
		}

		this.items.forEach(item => {
			let state = item.validate();
			if (!state.isValid) {
				errors.push(state);
			}
		});

		return {
			name: `${this.name || '[Без имени]'}`,
			isValid: !errors.length,
			errors
		}
	}
}