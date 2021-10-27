import { Attachment } from "@/entities/Attachment";
import { plainToClass, classToPlain } from "class-transformer";
import { collection, CollectionReference, DocumentData, getFirestore, addDoc } from "@firebase/firestore";
import { getStorage, ref as fileRef, uploadBytes, getDownloadURL } from "firebase/storage";

export class AttachmentRepository {
    private storage = getStorage();
    static CollectionName = 'Attachments';

    private db = getFirestore();
    private attachmentCollection: CollectionReference<DocumentData>;

    constructor() {
        this.attachmentCollection = collection(this.db, AttachmentRepository.CollectionName);
    }

    async save(item: Attachment) {
        const storageRef = fileRef(this.storage, item.name);
        const uploaded = await uploadBytes(storageRef, item.url as Blob);
        item.url = await getDownloadURL(uploaded.ref);
        await addDoc(this.attachmentCollection, classToPlain(item));
    }
}