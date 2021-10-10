<template>
  <div>
    <div v-for="(object, index) in order.objects" :key="object.id">
      <div style="vertical-align: central; font-weight: normal" align="center">
        Накладная
        <input
          style="width: 16cm"
          type="text"
          :value="
            '№' +
            order.id +
            ' ' +
            order.name +
            '-' +
            object.index +
            ' от ' +
            formatDate(new Date().getTime())
          "
        />
      </div>

      Отпрвитель:
      <br />
      <input
        class="header"
        type="text"
        value='ООО "Широкий формат",  г. Мытищи. Олимпийский пр-т, стр. 10, https://rpkwf.ru'
      />
      <br />
      <input
        class="header"
        type="text"
        value="(495) 637-68-82; (495) 637-68-83"
      />
      <br />
      <input class="header" type="text" :value="currentUser.name" />
      <br />
      <br />
      Получатель:
      <br />
      <textarea class="header" rows="3"
        >{{ order.receiver || order.client }}, {{
          order.receiverContacts || order.clientContacts
        }}, {{ order.receiverAddress || order.clientAddress }}</textarea
      >
      <br />

      <div style="font-weight: 600; font-size: 16px">
        Объект {{ object.index }}. {{ object.name }}
      </div>
      <table bordercolor="black" border="1" cellspacing="0" class="header">
        <thead>
          <tr style="font-weight: bold">
            <td>#</td>
            <td>Название</td>
            <td>Материал</td>
            <td>Размер, ШхВ</td>
            <td>Кол-во</td>
            <td>Для менеджера</td>
            <td>Примечания</td>
            <td class="print-hide" title="Добавить позицию">
              <button
                style="width: 30px; height: 30px"
                @click="addItem(object)"
              >
                +
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in object.items.filter((i) => !i.isCanceled)"
            :key="item.id"
          >
            <td style="width: 1cm">
              <textarea style="width: 95%"
                >{{ object.index }}.{{
                  item.index.toString().padStart(2, "0")
                }}</textarea
              >
            </td>
            <td style="width: 10cm">
              <textarea style="width: 95%" rows="2">{{ item.name }}</textarea>
            </td>
            <td style="width: 3cm">
              <textarea style="width: 95%" rows="2"
                >{{ item.material }}, {{ item.sides }}</textarea
              >
            </td>
            <td style="width: 3cm">
              <textarea style="width: 95%"
                >{{ formatDecimal(item.width) }}х{{
                  formatDecimal(item.height)
                }} мм.</textarea
              >
            </td>
            <td style="width: 1cm">
              <textarea style="width: 95%">{{ item.count }}</textarea>
            </td>
            <td style="width: 7cm">
              <textarea style="width: 95%" rows="2"></textarea>
            </td>
            <td style="width: 7cm">
              <textarea style="width: 95%" rows="2">{{
                item.description
              }}</textarea>
            </td>
            <td class="print-hide">
              <button
                style="width: 30px; height: 30px"
                title="Удалить позицию"
                @click="removeItem(object, item)"
              >
                <strong>-</strong>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <br />
      <br />
      <br />
      <pre>
 Получатель __________________/_____________________________________________________/           "______"__________________ 202___ г.
                Подпись                   ФИО, должность                                                         Дата получения
</pre
      >

      <hr class="pagebreakhere" v-if="order.objects.length - 1 != index" />
      <p class="pagebreakhere" v-if="order.objects.length - 1 != index" />
      <br />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, inject } from "vue";
import { formatDate, formatDateTime, formatDecimal } from "@/utils/format";
import { UVOrderObject } from "@/entities/uv/UVOrderObject";
import { UVOrderObjectItem } from "@/entities/uv/UVOrderObjectItem";
import { UserProvider } from "@/providers/UserProvider";
import { UVOrder } from "@/entities/uv/UVOrder";

export default defineComponent({
  props: {
    order: UVOrder,
  },
  setup() {
    const userProvider = inject("UserProvider") as UserProvider;

    const removeItem = (object: UVOrderObject, item: UVOrderObjectItem) => {
      const index = object.items.indexOf(item);
      if (index > -1) {
        object.items.splice(index, 1);
      }
    };

    const addItem = (object: UVOrderObject) => {
      const allIndexes = object.items.map((o) => o.index);
      const max = Math.max(0, ...allIndexes) + 1;
      const newRow = new UVOrderObjectItem(max.toString(), max);
      object.items.push(newRow);
    };

    return {
      removeItem,
      addItem,

      currentUser: userProvider.currentUser,
      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
      formatDate: formatDate,
    };
  },
});
</script>