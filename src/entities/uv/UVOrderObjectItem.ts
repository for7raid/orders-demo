import { User } from '@/entities/User';
import { IUFOrderObjectItemHistoryItem } from '@/entities/uv/IUFOrderObjectItemHistoryItem';
import { Exclude, Expose } from 'class-transformer';
import { UVOrderObject } from './UVOrderObject';

export class UVOrderObjectItem {
	static Materials = ['ПВХ 1 мм', 'ПВХ 3 мм', 'ПВХ 5 мм', 'Картон', 'Картон+пленка', 'ПЭТ 0,5 мм', 'ПЭТ 0,7мм', 'ПЭТ 1 мм', 'Баннер', 'Пленка с ламинацией'];
	static Sides = ['4+0', '4+4'];
	
	id;
	index = 1;

	name: string | undefined;
	material = 'ПВХ 1 мм';
	sides = '4+0';
	height = 0;
	width = 0;
	count = 0;
	price = 0;

	coefficient = 0;
	additionalCost = 0;

	bending = {
		length: 0,
		price: 30
	};


	holes = {
		count: 0,
		price: 10
	};


	cutting = {
		do: false,
		price: 55
	};

	source: string | undefined;
	description: string | undefined;

	status: number;
	history: IUFOrderObjectItemHistoryItem[] = [];
  
	@Exclude()
	object: UVOrderObject | undefined;

	constructor(id: string, index: number) {
		this.id = id;
		this.index = index;
		this.status = -1;
	}
	@Expose()
	get perimeter() {
		return (this.height + this.width) * 2 / 1000;
	}
	@Expose()
	get square() {
		return (this.height * this.width) / 1000000;
	}
	@Expose()
	get total() {
		return Math.floor(
			this.count * (this.square * this.price +
				(this.cutting.price * this.perimeter * (this.cutting.do ? 1 : 0)) +
				((this.bending.length ?? 0) * this.bending.price) +
				(this.holes.count * this.holes.price)) * (1 + this.coefficient / 100)
			+ (this.additionalCost || 0)
		);
	}

	get isCanceled() {
		return [80].indexOf(this.status) > -1;
	}

	get canFinish() {
		return [40, 50].indexOf(this.status) > -1;
	}

	get isFinished() {
		return [70, 80, 90].indexOf(this.status) > -1;
	}

	get canWayBill() {
		return [60, 70].indexOf(this.status) > -1;
	}

	get canStart() {
		return [10, 20, 30].indexOf(this.status) > -1;
	}
	get canDelivery() {
		return [60, 70].indexOf(this.status) > -1;
	}
	get canDispatch() {
		return [60].indexOf(this.status) > -1;
	}

	get canCancel() {
		return [10, 20, 40, 60].indexOf(this.status) > -1;
	}

	get canTotalCancel() {
		return [30].indexOf(this.status) > -1;
	}

	get canChange() {
		return this.status <= 20;
	}

	added(user: User) {
		this.setStatus(10, user);
	}

	changed(user: User) {
		this.setStatus(20, user);
	}

	start(user: User) {
		this.setStatus(40, user);
	}

	finish(user: User) {
		this.setStatus(60, user);
	}

	cancel(user: User) {
		this.setStatus(80, user);
	}

	mistake(user: User) {
		this.setStatus(30, user);
	}

	dispatch(user: User) {
		this.setStatus(70, user);
	}

	markChanged(user: User) {
		this.setStatus(20, user);
	}

	setStatus(status: number, user: User) {
		if (this.status == status) return;

		this.history.push({
			date: (new Date()).getTime(),
			old: this.status,
			status: status,
			user: {
				id: user.id,
				name: user.name
			}
		});

		this.status = status;
	}

	validate() {
		const errors = [];
		if (!this.name || !this.name.toString().trim().length) {
			errors.push('--- Укажите имя макета.');
		}
		if (!this.count || this.count <= 0) {
			errors.push('--- Не указано количество изделий.')
		}

		if (!this.square || this.square <= 0) {
			errors.push('--- Неверная площадь изделия. Проверьте размеры.')
		}

		return {
			isValid: !errors.length,
			message: errors.join('<br/>')
		}
	}

	invalidate() {
		this.additionalCost = this.additionalCost || 0;
		this.coefficient = this.coefficient || 0;
		this.price = this.price || 0;
		this.height = this.height || 0;
		this.width = this.width || 0;
		this.count = this.count || 0;
	}
}