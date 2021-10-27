export class PrintOrderItemPostProcessing {
	left = false;
	right = false;
	top = false;
	bottom = false;
	size = 0;
	price = 0;

	get all() {
		return this.left && this.right && this.top && this.bottom;
	}

	set all(value) {
		this.left = this.right = this.top = this.bottom = value;
	}

	get has() {
		return this.left || this.right || this.top || this.bottom;
	}

	getCost(height: number, width: number): number {
		let length = 0;
		if (this.left) length += height;
		if (this.right) length += height;
		if (this.top) length += width;
		if (this.bottom) length += width;
		return length * this.price;

	}

	toString() {
		if (!this.has) return '';
		if (this.all) return 'Все';

		let str = '';

		str += (this.top ? 'В' : '-');
		str += (this.bottom ? 'Н' : '-');
		str += (this.right ? 'П' : '-');
		str += (this.left ? 'Л' : '-');

		if (this.size) str += (`${this.size}см.`);

		return str;
	}
}