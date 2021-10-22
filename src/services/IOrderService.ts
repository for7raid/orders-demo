import { OrderBase } from "@/entities/OrderBase";

export interface IOrderService {
    getAll(): Promise<OrderBase[]>
    find(id: number | string): Promise<OrderBase | undefined>
    save(order: OrderBase): void
    startOrder(order: OrderBase): void
    dispatchOrder(order: OrderBase): void
    cancelOrder(order: OrderBase): void
    startItem(order: OrderBase, item: any): void
    finishItem(order: OrderBase, item: any): void
    dispatchItem(order: OrderBase, item: any): void
    mistakeItem(order: OrderBase, item: any): void
    cancelItem(order: OrderBase, item: any): void
}