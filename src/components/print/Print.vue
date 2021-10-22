<template>
  <div>
    <div class="style1">
      Задание на
      <span style="font-weight: 600"
        >Печать №{{ order.id }} {{ order.name }}</span
      >
      от {{ formatDateTime(order.date) }}, {{ order.user.name }}
    </div>
    <br />
    <div style="text-align: left">
      Клиент: {{ order.client.name }}, {{ order.client.contacts }},
      {{ order.clientAddress }}
      <br />

      <span v-if="order.receiver.name || order.receiver.address">
        Получатель: {{ order.receiver.name }}, {{ order.receiver.contacts }},
        {{ order.receiver.address }}
        <br />
        <br />
      </span>
    </div>
    <br />

    <table style="width: 20cm" bordercolor="black" border="1" cellspacing="0">
      <tr style="font-weight: bold">
        <td class="wrap">Макет</td>

        <td class="wrap">Сюжет</td>
        <td class="textCenter">Кол-во</td>
        <td>Материал, плотность</td>
        <td>Размер</td>
        <td>Постобработка</td>

        <td>Упаковка</td>

        <td class="wrap">Примечание</td>
      </tr>

      <tr v-for="item in order.items" :key="item.id">
        <td class="wrap">
          {{ item.name }}
        </td>

        <td class="wrap">
          {{ item.content }}
        </td>
        <td class="textCenter">
          {{ item.count }}
        </td>
        <td>
          {{ item.materialType }} ,
          {{ item.density }}
        </td>
        <td>
          {{ item.size }}
        </td>
        <td class="wrap"></td>

        <td>
          {{ item.wrapping }}
        </td>

        <td class="wrap">
          {{ item.description }}
        </td>
      </tr>
    </table>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import { PrintOrder } from "@/entities/print/PrintOrder";

export default defineComponent({
  props: {
    order: PrintOrder,
  },
  setup() {
    return {
      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
    };
  },
});
</script>