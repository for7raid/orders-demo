import { OrderBase } from "@/entities/OrderBase";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { PrintOrderItem } from "@/entities/print/PrintOrderItem";
import { UVOrderObjectItem } from "@/entities/uv/UVOrderObjectItem";
import { UserProvider } from "@/providers/UserProvider";
import { AttachmentRepository } from "@/repositories/AttachmentRepository";
import { IOrderRepository } from "@/repositories/IOrderRepository";
import { IOrderService } from "./IOrderService";

export class OrderService implements IOrderService {
    private repo: IOrderRepository;
    private userProvider = new UserProvider();
    private attachments: AttachmentRepository;

    constructor(repo: IOrderRepository, attachments: AttachmentRepository, userProvider: UserProvider) {
        this.repo = repo;
        this.userProvider = userProvider;
        this.attachments = attachments;

        // const fake = new FakeOrderRepository();
        // fake.getAll().then(all => {
        //     all.forEach(async (order) => {
        //         await this.save(order);
        //     })
        // })
    }

    async getAll(): Promise<OrderBase[]> {
        return this.repo.getAll();
    }

    async find(id: number | string): Promise<OrderBase | undefined> {
        return this.repo.find(id);
    }

    async save(order: OrderBase) {
        order.changeDate = new Date().getTime();

        if (order instanceof PrintOrder) {
            const tasks = order.items.filter(i => !i.preview.saved).map(i => {
                i.preview.dataId = `orders\\${order.id}`;
                i.preview.name = `orders\\${order.id}\\${i.index}-${i.name}.jpg`;
                return this.attachments.save(i.preview)
            });

            await Promise.all(tasks);
        }


        return this.repo.save(order);
    }

    async startOrder(order: OrderBase) {
        order.start(this.userProvider.currentUser);
        await this.save(order);
    }

    async dispatchOrder(order: OrderBase) {
        order.dispatch(this.userProvider.currentUser);
        await this.save(order);
    }

    async cancelOrder(order: OrderBase) {
        order.cancel(this.userProvider.currentUser);
        await this.save(order);
    }

    async startItem(order: OrderBase, item: any) {
        item.start(this.userProvider.currentUser);
        await this.save(order);
    }

    async finishItem(order: OrderBase, item: any) {
        if (item instanceof UVOrderObjectItem) {
            item.finish(this.userProvider.currentUser);
        }
        if (item instanceof PrintOrderItem) {
            item.finish(this.userProvider.currentUser);
        }
        await this.save(order);
    }

    async dispatchItem(order: OrderBase, item: any) {
        if (item instanceof UVOrderObjectItem) {
            item.dispatch(this.userProvider.currentUser);
        }
        if (item instanceof PrintOrderItem) {
            item.dispatch(this.userProvider.currentUser);
        }
        await this.save(order);
    }

    async mistakeItem(order: OrderBase, item: any) {
        if (item instanceof UVOrderObjectItem) {
            item.mistake(this.userProvider.currentUser);
        }
        if (item instanceof PrintOrderItem) {
            item.mistake(this.userProvider.currentUser);
        }
        await this.save(order);
    }

    async cancelItem(order: OrderBase, item: any) {
        if (item instanceof UVOrderObjectItem) {
            item.cancel(this.userProvider.currentUser);
        }
        if (item instanceof PrintOrderItem) {
            item.cancel(this.userProvider.currentUser);
        }
        await this.save(order);
    }
}