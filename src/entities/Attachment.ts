export class Attachment {
    dataId!: string;
    name!: string;
    url!: string | Blob;

    get has(){
        return !!this.url;
    }

    get saved(){
        return typeof this.url === 'string';
    }
}