import { Expose, Type } from 'class-transformer';
import { OrderBase } from '../OrderBase';
import { UVOrderObject } from './UVOrderObject';


export class UVOrder extends OrderBase {

	@Type(() => UVOrderObject)
	objects: UVOrderObject[] = [];
	isCalculating = false;

	@Expose()
	get statuses() {
		if (this.isCalculating) return [65];

		const allStatues: number[] = [];
		this.objects.forEach(object => {
			object.items.forEach(item => {
				if (allStatues.indexOf(item.status) < 0) {
					allStatues.push(item.status);
				}
			})
		});
		allStatues.sort((a, b) => a - b);
		return allStatues;
	}
	@Expose()
	get status() {
		if (this.isCalculating) return 65;

		let s = 100;
		this.objects.forEach(object => {
			object.items.forEach(item => {
				s = Math.min(s, item.status);
			})
		});
		return s;
	}
	@Expose()
	get total() {
		let total = 0;
		this.objects.forEach(object => {
			object.items.forEach(item => {
				if (!item.isCanceled) {
					total += item.total;
				}
			})
		});

		return total;
	}

	get canProcess(){
		return this.status != 65;
	}

	validate() {
		const errors = [];
		if (!this.name || !this.name.toString().trim().length) {
			errors.push('Укажите имя заказа');
		}

		if (!this.client || !this.client.toString().trim().length) {
			errors.push('Укажите клиента заказа');
		}

		if (!this.objects || !this.objects.length) {
			errors.push('Добавьте объекты');
		}

		this.objects.forEach(item => {
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