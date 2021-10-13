import XLSX from 'xlsx';

import { OrderBase } from "@/entities/OrderBase";
import { UVOrder } from "@/entities/uv/UVOrder";
import { UVOrderObject } from "@/entities/uv/UVOrderObject";

export class XlsxService {
    export(order: OrderBase, ...params: any[]) {
        if (order instanceof UVOrder) {
            this.exportUV(order as UVOrder, params[0] as UVOrderObject)
        }
    }

    private exportUV(order: UVOrder, objectToExport: UVOrderObject) {
        //debugger;
        const wb = XLSX.utils.book_new();
        /* make worksheet */
        const ws_data: (any)[][] = [
            ['№' + order.id, order.name],
            [],
            ['Объект',
                "Макет",
                "Материал",
                "Ширина, мм.",
                "Высота, мм.",

                "Кол-во",
                "Ширина, м.",
                "Высота, м.",
                "S, м2",
                "Периметр",
                "Цена печати за м2",
                "Фреза",
                "Цена за фрезу",
                "Отверстия",
                "Цена за отверсия",
                "Гибка",
                "Цена за гибку",
                "Скидка/наценка",
                "Доп. стоимость",
                "Итого, руб,  с НДС",
                "Примечания"
            ]
        ];

        for (let object of order.objects) {
            if (objectToExport && objectToExport != object) continue;

            ws_data.push([object.name]);
            for (let item of object.items) {
                const row = [
                    object.name,
                    item.name,
                    item.material,
                    item.width,
                    item.height,
                    item.count,
                    item.width / 1000,
                    item.height / 1000,
                    item.square,
                    item.perimeter,
                    item.price,
                    item.cutting.do ? item.perimeter : 0,
                    item.cutting.price,
                    item.holes.count,
                    item.holes.price,
                    item.bending.length,
                    item.bending.price,
                    item.coefficient,
                    item.additionalCost,
                    item.isCanceled ? 0 : item.total,
                    (item.description || '') + (item.isCanceled ? '  Отменен' : '')
                ];

                ws_data.push(row);
            }

            let total = [];
            total[19] = object.total;
            ws_data.push(total);

        }

        ws_data.push([], [], []);

        for (let object of order.objects) {
            if (objectToExport && objectToExport != object) continue;
            ws_data.push([object.name, '', '', '', object.total]);
        }

        if (!objectToExport) {
            ws_data.push([]);
            ws_data.push(['Итого по заказу', '', '', '', order.total]);
        }

        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const fileName = order.name + (objectToExport ? ' ' + objectToExport.name : '') + '.xlsx';

        XLSX.writeFile(wb, fileName);
    }
}