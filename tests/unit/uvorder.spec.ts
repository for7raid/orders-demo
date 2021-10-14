import { UVOrderObjectItem } from '@/entities/uv/UVOrderObjectItem'
import { expect } from 'chai'


describe('UV Orders', () => {
    it('square', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;

        expect(item.square).to.eq(2);

    })

    it('perimeter', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;

        expect(item.perimeter).to.eq(6);

    })

    it('simple total', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;
        item.price = 1000;
        item.count = 2

        expect(item.total).to.eq(4000);

    })

    it('total discount', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;
        item.price = 1000;
        item.count = 2
        item.coefficient = -10;

        expect(item.total).to.eq(3600);

    })

    it('total additionalCost', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;
        item.price = 1000;
        item.count = 2
        item.additionalCost = 200;

        expect(item.total).to.eq(4200);

    })

    it('total holes', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;
        item.price = 1000;
        item.count = 2
        item.holes.count = 10;
        item.holes.price = 10;

        expect(item.total).to.eq(4200);

    })

    it('total bending', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;
        item.price = 1000;
        item.count = 2
        item.bending.price = 10;
        item.bending.length = item.perimeter;

        expect(item.total).to.eq(4120);

    })

    it('total cutting', () => {
        const item = new UVOrderObjectItem("a", 1);
        item.height = 1000;
        item.width = 2000;
        item.price = 1000;
        item.count = 2
        item.bending.price = 10;
        item.cutting.do = true;

        expect(item.total).to.eq(4660);

    })
})
