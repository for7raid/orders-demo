import { OrderBase } from "@/entities/OrderBase";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { PrintOrderItem } from "@/entities/print/PrintOrderItem";
import { UVOrder } from "@/entities/uv/UVOrder";
import { UVOrderObjectItem } from "@/entities/uv/UVOrderObjectItem";
import { UserProvider } from "@/providers/UserProvider";
import { OrderRepository } from "@/repositories/OrderRepository";

export class OrderService {
    private repo = new OrderRepository();
    private userProvider = new UserProvider();

    async getAll(): Promise<OrderBase[]> {
        return this.repo.getAll();
    }

    async find(id: string): Promise<OrderBase | undefined> {
        return this.repo.find(id);
    }

    async save(order: OrderBase) {
        order.changeDate = new Date().getTime();
        return this.repo.save(order);
    }

    async startOrder(order: OrderBase) {
        if (order instanceof UVOrder) {
            order.objects.forEach(object => {
                object.items.forEach(item => {
                    if (item.canStart) {
                        item.start(this.userProvider.currentUser);
                    }
                })
            })
        }
        if (order instanceof PrintOrder) {
            order.items.forEach(item => {
                if (item.canStart) {
                    item.start(this.userProvider.currentUser);
                }
            })
        }
        await this.save(order);
    }

    async dispatchOrder(order: OrderBase) {
        if (order instanceof UVOrder) {
            order.objects.forEach(object => {
                object.items.forEach(item => {
                    if (item.canDispatch) {
                        item.dispatch(this.userProvider.currentUser);
                    }
                })
            })
        }
        if (order instanceof PrintOrder) {
            order.items.forEach(item => {
                if (item.canDispatch) {
                    item.dispatch(this.userProvider.currentUser);
                }
            })
        }
        await this.save(order);
    }

    async cancellOrder(order: OrderBase) {
        if (order instanceof UVOrder) {
            order.objects.forEach(object => {
                object.items.forEach(item => {
                    item.cancel(this.userProvider.currentUser);
                })
            })
        }
        if (order instanceof PrintOrder) {
            order.items.forEach(item => {
                item.cancel(this.userProvider.currentUser);
            })
        }
        await this.save(order);
    }

    async startItem(order: OrderBase, item: any) {
        if (item instanceof UVOrderObjectItem) {
            item.start(this.userProvider.currentUser);
        }
        if (item instanceof PrintOrderItem) {
            item.start(this.userProvider.currentUser);
        }
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