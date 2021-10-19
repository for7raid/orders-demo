import { OrderBase } from "@/entities/OrderBase";

export interface IOrderRepository {
    getAll(): Promise<OrderBase[]>
    find(id: number | string): Promise<OrderBase | undefined>
    save(order: OrderBase): Promise<void>
}