<template>
  <div>
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
      >{{ order.receiver.name || order.client.name }}, {{
        order.receiver.contacts || order.client.contacts
      }}, {{ order.receiver.address || order.client.address }}</textarea
    >
    <br />

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
            <button style="width: 30px; height: 30px" @click="addItem()">
              +
            </button>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in order.items.filter((i) => !i.isCanceled)"
          :key="item.id"
        >
          <td style="width: 1cm">
            <textarea style="width: 95%">{{
              item.index.toString().padStart(2, "0")
            }}</textarea>
          </td>
          <td style="width: 10cm">
            <textarea style="width: 95%" rows="2">{{ item.name }}</textarea>
          </td>
          <td style="width: 3cm">
            <textarea style="width: 95%" rows="2">
 {{ item.materialType }}, {{ item.materialProperties }}</textarea
            >
          </td>
          <td style="width: 3cm">
            <textarea style="width: 95%"
              >{{ formatDecimal(item.width) }}х{{
                formatDecimal(item.height)
              }} м.</textarea
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
              @click="removeItem(item)"
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
    </pre>
  </div>
</template>


<script lang="ts">
import { defineComponent, inject, toRefs } from "vue";
import { formatDate, formatDateTime, formatDecimal } from "@/utils/format";
import { UserProvider } from "@/providers/UserProvider";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { PrintOrderItem } from "@/entities/print/PrintOrderItem";

export default defineComponent({
  props: {
    order: {
      type: PrintOrder,
      required: true,
    },
  },
  setup(props) {
    const { order } = toRefs(props);
    const userProvider = inject("UserProvider") as UserProvider;

    const removeItem = (item: PrintOrderItem) => {
      const index = order.value.items.indexOf(item);
      if (index > -1) {
        order.value.items.splice(index, 1);
      }
    };

    const addItem = () => {
      order.value.createItem();
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