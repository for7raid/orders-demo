import { createId } from "@/utils/uuid";
import { Expose, Type } from "class-transformer";
import { OrderBase } from "../OrderBase";
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

	createItem() {
		const allIndexes = this.items.map(o => o.index);
		const max = Math.max(0, ...allIndexes) + 1;
		return this.items.push(new PrintOrderItem(createId(), max));
	}

	validate() {
		const errors = [];
		if (!this.name || !this.name.toString().trim().length) {
			errors.push('Укажите имя заказа');
		}

		if (!this.client || !this.client.toString().trim().length) {
			errors.push('Укажите клиента заказа');
		}

		if (!this.items || !this.items.length) {
			errors.push('Добавьте макеты');
		}

		this.items.forEach(item => {
			let state = item.validate();
			if (!state.isValid) {
				errors.push(`<br/>- ${item.index} ${item.name || '[Без названия]'}<br/>` + state.message);
			}
		});

		return {
			isValid: !errors.length,
			message: errors.join('<br/>')
		}
	}
}