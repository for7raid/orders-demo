export class ImageService {
    static resize(file: File, maxSize: number, maxWidth: number, maxHeight: number): Promise<Blob> {
        return new Promise((pass) => {
            const img = document.createElement("img");
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const x = Math.min(1, maxSize / file.size, maxWidth / img.width, maxHeight / img.height);

                if (x == 1) {
                    return pass(file);
                }

                canvas.width = img.width * x;
                canvas.height = img.height * x;

                // Actual resizing
                ctx!.drawImage(img, 0, 0, img.width * x, img.height * x);
                ctx!.imageSmoothingEnabled = true;
                ctx!.imageSmoothingQuality = "medium";

                canvas.toBlob(blob => pass(blob!));
            }
            img.src = URL.createObjectURL(file);
        });


    }
}