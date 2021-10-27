import { Expose, Type } from "class-transformer";
import { Attachment } from "../Attachment";
import { IValidationError } from "../IValidationError";
import { User } from "../User";
import { PrintOrderItemPostProcessing } from "./PrintOrderItemPostProcessing";

export class PrintOrderItem {

	static MaterialTypes = ["Акрил", "Пленка"];
	static MaterialSubTypes = ["-", "Ламинированный", "Литой"];
	static MaterialProperties = ["-", "Ламинированный", "Литой"];
	static Densities = [280, 300];
	static Resolutions = [0, 3];
	static Wrappings = ["Рулон", "Конерт", "Туба"];
	static PriceTypes = [{ name: "кв. метр", value: 1 }, { name: "штуку", value: 2 }]

	id: string;
	index = 1;

	name!: string;
	fileName!: string;
	content!: string;
	description!: string;
	materialType!: string;
	materialSubType!: string;
	materialProperties!: string;
	color!: string;
	density!: number;
	height: number = 0;
	width: number = 0;
	wrapping!: string;
	resolution!: number;
	doubleSquare = false;
	priceType = 1;
	price: number = 0;
	count: number = 0;
	@Type(() => Attachment)
	preview!: Attachment;

	@Type(() => PrintOrderItemPostProcessing)
	holes!: PrintOrderItemPostProcessing;
	@Type(() => PrintOrderItemPostProcessing)

	pocket!: PrintOrderItemPostProcessing;
	@Type(() => PrintOrderItemPostProcessing)

	strengthening!: PrintOrderItemPostProcessing;
	@Type(() => PrintOrderItemPostProcessing)

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
		this.preview = new Attachment();
	}
	@Expose()
	get square() {
		return (this.height * this.width) * (this.doubleSquare ? 2 : 1);
	}
	@Expose()
	get perimeter() {
		return (this.height + this.width) * 2;
	}
	@Expose()
	get total() {

		let total = this.price * (this.priceType == 1 ? this.square : 1);

		total = total + this.holes.getCost(this.height, this.width)
		total = total + this.pocket.getCost(this.height, this.width)
		total = total + this.strengthening.getCost(this.height, this.width)
		total = total + this.welding.getCost(this.height, this.width)

		total = total * this.count;

		return Math.floor(total);
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

	validate(): IValidationError {
		const errors: IValidationError[] = [];
		if (!this.name || this.name.toString().trim().length < 4) {
			errors.push({ name: 'Укажите имя макета' });
		}

		// if (!this.content || this.content.toString().trim().length < 4) {
		// 	errors.push({ name: 'Укажите содержание макета' });
		// }

		if (!this.preview || !this.preview.has) {
			errors.push({ name: 'Загрузите превью макета' });
		}

		if (!this.total || this.total <= 0) {
			errors.push({ name: 'Стоимость макета неверная. Проверьте размеры, количество, цену.' })
		} else if (!this.price || this.price <= 0) {
			errors.push({ name: 'Укажите цену печати.' })
		}

		return {
			name: `${this.index}. ${this.name || '[Без названия]'}`,
			isValid: !errors.length,
			errors
		}
	}
}