import { OrderBase } from "@/entities/OrderBase";
import { UVOrder } from "@/entities/uv/UVOrder";
import { plainToClass, classToPlain } from "class-transformer";

import { getFirestore, collection, doc, getDoc, getDocs, setDoc, DocumentData, CollectionReference, query, limit, orderBy, SnapshotOptions, QueryDocumentSnapshot } from "firebase/firestore"
import { FakeOrderRepository } from "./FakeOrderRepository";

const orderConverter = {
    toFirestore: (order: OrderBase): any => {
        return classToPlain(order);
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return plainToClass(UVOrder, data) as any;
    }
};


export class OrderRepository {
    static CollectionName = 'Orders';
    // static IDCounterCollectionName = 'Counters';

    private db = getFirestore();
    private ordersCollection: CollectionReference<DocumentData>;
    // private counterCollection: CollectionReference<DocumentData>;

    constructor() {
        this.ordersCollection = collection(this.db, OrderRepository.CollectionName).withConverter(orderConverter);
        // this.counterCollection = collection(this.db, OrderRepository.IDCounterCollectionName);

        // const fake = new FakeOrderRepository();
        // fake.getAll().then(all => {
        //     all.forEach(async (order) => {
        //         await this.save(order);
        //     })
        // })
    }

    async getAll(): Promise<OrderBase[]> {
        const q = query(this.ordersCollection, orderBy("statuses", "desc"), orderBy("id", "desc"), limit(500)).withConverter(orderConverter);
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(d=>d.data()) as OrderBase[];
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
