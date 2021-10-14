import { Expose } from "class-transformer";
import { User } from "../User";
import { PrintOrderItemPostProcessing } from "./PrintOrderItemPostProcessing";

export class PrintOrderItem {
	id: string;
	index = 1;

	name!: string;
	//fileName;
	content!: string;
	description!: string;
	materialType!: string;
	materialSubType!: string;
	materialProperties!: string;
	color!: string;
	density!: number;
	thinkness!: number;
	height!: number;
	width!: number;
	wrapping!: string;
	resolution!: number;
	doubleSquare = false;
	priceType = 1;
	price!: number;
	count!: number;

	holes!: PrintOrderItemPostProcessing;
	pocket!: PrintOrderItemPostProcessing;
	strengthening!: PrintOrderItemPostProcessing;
	welding!: PrintOrderItemPostProcessing;

	status = -1;
	history: {
		date: number;
		old: number;
		status: number;
		user: User;
	}[] = [];

	constructor(id: string, index: number) {
		this.id = id;
		this.index = index;
		this.holes = new PrintOrderItemPostProcessing();
		this.pocket = new PrintOrderItemPostProcessing();
		this.strengthening = new PrintOrderItemPostProcessing();
		this.welding = new PrintOrderItemPostProcessing();
	}
	@Expose()
	get square() {
		return (this.height * this.width) * (this.doubleSquare ? 2 : 1);
	}
	@Expose()
	get total() {
		return Math.floor(
			0);
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
			user: user
		});

		this.status = status;
	}

	validate() {
		const errors = [];
		if (!this.name || this.name.toString().trim().length < 4) {
			errors.push('- Укажите имя макета');
		}

		if (!this.content || this.content.toString().trim().length < 4) {
			errors.push('- Укажите содержание макета');
		}

		// if (!this.fileName || !this.fileName.toString().trim().length) {
		// 	errors.push('- Загрузите превью макета');
		// }

		if (!this.total || this.total <= 0) {
			errors.push('- Стоимость макета неверная. Проверьте размеры, количество, цену.')
		}

		return {
			isValid: !errors.length,
			message: errors.join('<br/>')
		}
	}
}