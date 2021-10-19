import { OrderBase } from "@/entities/OrderBase";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { UVOrder } from "@/entities/uv/UVOrder";
import { plainToClass, classToPlain } from "class-transformer";

import { getFirestore, collection, doc, getDoc, getDocs, setDoc, DocumentData, CollectionReference, query, limit, orderBy, SnapshotOptions, QueryDocumentSnapshot } from "firebase/firestore"
import { IOrderRepository } from "./IOrderRepository";

const orderConverter = {
    toFirestore: (order: OrderBase): any => {
        return classToPlain(order);
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        const typeName = data.__type;
        const type = typeName == 'UVOrder' ? UVOrder :
            typeName == 'PrintOrder' ? PrintOrder :
                OrderBase;
        return plainToClass(type, data) as any;
    }
};


export class OrderRepository implements IOrderRepository {
    static CollectionName = 'Orders';
    // static IDCounterCollectionName = 'Counters';

    private db = getFirestore();
    private ordersCollection: CollectionReference<DocumentData>;
    // private counterCollection: CollectionReference<DocumentData>;

    constructor() {
        this.ordersCollection = collection(this.db, OrderRepository.CollectionName).withConverter(orderConverter);
        // this.counterCollection = collection(this.db, OrderRepository.IDCounterCollectionName);

       
    }

    async getAll(): Promise<OrderBase[]> {
        const q = query(this.ordersCollection, orderBy("statuses"), orderBy("id", "desc"), limit(500)).withConverter(orderConverter);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(d => d.data()) as OrderBase[];
    }

    async find(id: string): Promise<OrderBase | undefined> {
        const docRef = doc(this.ordersCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as OrderBase;
        } else {
            return undefined;
        }
    }

    async save(order: OrderBase) {
        const docRef = doc(this.ordersCollection, order.id!.toString());
        await setDoc(docRef, order);
    }
}
