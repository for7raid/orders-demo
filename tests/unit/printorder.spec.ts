import { PrintOrder } from '@/entities/print/PrintOrder';
import { PrintOrderItem } from '@/entities/print/PrintOrderItem';
import { PrintOrderItemPostProcessing } from '@/entities/print/PrintOrderItemPostProcessing';
import { expect } from 'chai'


describe('Print Order Postprocessing', () => {
    it('post processing cost left', () => {
        const item = new PrintOrderItemPostProcessing();
        item.price = 3;
        item.left = true;
        const cost = item.getCost(1, 2);
        expect(cost).to.eq(3);
    })

    it('post processing cost right', () => {
        const item = new PrintOrderItemPostProcessing();
        item.price = 3;
        item.right = true;
        const cost = item.getCost(1, 2);
        expect(cost).to.eq(3);
    })

    it('post processing cost top', () => {
        const item = new PrintOrderItemPostProcessing();
        item.price = 3;
        item.top = true;
        const cost = item.getCost(1, 2);
        expect(cost).to.eq(6);
    })

    it('post processing cost bottom', () => {
        const item = new PrintOrderItemPostProcessing();
        item.price = 3;
        item.bottom = true;
        const cost = item.getCost(1, 2);
        expect(cost).to.eq(6);
    })

    it('post processing cost all', () => {
        const item = new PrintOrderItemPostProcessing();
        item.price = 3;
        item.all = true;
        const cost = item.getCost(1, 2);
        expect(cost).to.eq(18);
    })
});

describe('Print Order item cost', () => {
    it('per square cost', () => {
        const item = new PrintOrderItem("",1);
        item.price = 2;
        item.priceType = 1;
        item.width = 2;
        item.height = 3;
        item.count = 2;
       
        expect(item.total).to.eq(24);
    })

    it('per square cost doubleSquare', () => {
        const item = new PrintOrderItem("",1);
        item.price = 2;
        item.priceType = 1;
        item.width = 2;
        item.height = 3;
        item.count = 2;
        item.doubleSquare = true;
       
        expect(item.total).to.eq(48);
    })

    it('per item cost', () => {
        const item = new PrintOrderItem("",1);
        item.price = 2;
        item.priceType = 2;
        item.width = 2;
        item.height = 3;
        item.count = 2;
        item.doubleSquare = true;

        expect(item.total).to.eq(4);
    })

    it('per square cost doubleSquare  + all post processing', () => {
        const item = new PrintOrderItem("",1);
        item.price = 2;
        item.priceType = 1;
        item.width = 2;
        item.height = 3;
        item.count = 2;
        item.doubleSquare = true;

        item.holes.all = true;
        item.holes.price = 2;
        item.welding.all = true;
        item.welding.price = 2;
        item.strengthening.all = true;
        item.strengthening.price = 2;
        item.pocket.all = true;
        item.pocket.price = 2;
       
        expect(item.total).to.eq(48 + 160);
    })

});