import { OrderBase } from "@/entities/OrderBase";
import { User } from "@/entities/User";
import { UVOrder } from "@/entities/uv/UVOrder";
import { UVOrderObject } from '@/entities/uv/UVOrderObject';
import { UVOrderObjectItem } from '@/entities/uv/UVOrderObjectItem';
import { UVOrderObjectItemStatus } from '@/entities/uv/UVOrderObjectItemStatus';

import { createId } from "@/utils/uuid";

export class FakeOrderRepository {
    private FakeData: OrderBase[] = [];
    private countUF = 5;
    private countPrint = 0;

    constructor() {

        for (var i = 0; i < this.countUF; i++) {
            let order = new UVOrder(new User(`user${i}`, `user name ${i}`));
            //order.id = i;
            order.name = "order " + i;
            order.client = 'Client ' + i;
            order.clientAddress = 'Client Address ' + i;
            order.receiver = 'Client Receiver ' + i;

            this.FakeData.push(order);

            for (var j = 0; j < 5; j++) {
                let object = new UVOrderObject(createId(), j);
                object.name = 'Object ' + i + '-' + j;
                object.index = j + 1;
                order.objects.push(object);

                for (var k = 0; k < 3; k++) {
                    let item = new UVOrderObjectItem(createId(), k);
                    item.index = k + 1;
                    item.name = `item ${k} of object ${j} order ${i}`;
                    item.count = k + 1;
                    item.height = Math.floor(100 + Math.random() * 100);
                    item.width = Math.floor(100 + Math.random() * 100);
                    item.price = Math.floor(1000 + Math.random() * 500);



                    item.start(order.user);
                    item.finish(order.user);
                    item.dispatch(order.user);

                    item.status = Number(Object.keys(UVOrderObjectItemStatus)[Math.floor(Math.random() * 8)]);

                    object.items.push(item);
                }
            }
        }


        // for (var i = countUF; i < countUF + countPrint; i++) {
        //     let order = new PrintOrder();
        //     order.id = i;
        //     order.name = "print order " + i;
        //     order.client = 'Client ' + i;
        //     order.clientAddress = 'Client Address ' + i;
        //     order.receiver = 'Client Receiver ' + i;

        //     order.user = new User(`user${i}`, `user name ${i}`, 'sdf@sdf.ru', 16);

        //     FakeData.push(order);



        //     for (var k = 0; k < 100; k++) {
        //         let item = new PrintOrderItem();
        //         item.id = utils.createId();
        //         item.index = k + 1;
        //         item.name = `item ${k} order ${i}`;
        //         item.count = k + 1;
        //         item.height = Math.floor(100 + Math.random() * 100);
        //         item.width = Math.floor(100 + Math.random() * 100);
        //         item.price = Math.floor(1000 + Math.random() * 500);

        //         item.content = 'Содрежние ' + k;
        //         item.desctiption = 'примечание' + k;
        //         item.materialType = 'материал' + k;
        //         item.materialSubType = 'тим материала' + k;
        //         item.materialProperties = 'свойства' + k;
        //         item.color = 'цвет' + k;
        //         item.density = k;
        //         item.thinkness = k;
        //         item.wrapping = 'упаковка' + k;
        //         item.resolution = k;
        //         item.doubleSquare = k % 2;
        //         item.priceType = k % 2;


        //         item.start(order.user);
        //         item.finish(order.user);
        //         item.dispatch(order.user);

        //         item.status = Number(Object.keys(UFOrderObjectItemStatus)[Math.floor(Math.random() * 8)]);


        //         const getPostProp = () => {
        //             const pp = new PrintOrderItemPostProcessing();
        //             pp.price = k;

        //             pp.left = Boolean(Math.random() * 2 > 1);
        //             pp.right = Boolean(Math.random() * 2 > 1);
        //             pp.top = Boolean(Math.random() * 2 > 1);
        //             pp.bottom = Boolean(Math.random() * 2 > 1);

        //             return pp;
        //         }

        //         item.holes = getPostProp();
        //         item.pocket = getPostProp();
        //         item.strengthening = getPostProp();
        //         item.welding = getPostProp();

        //         order.items.push(item);
        //     }

        //}
    }

    async getAll() {
        return this.FakeData;
    }

}