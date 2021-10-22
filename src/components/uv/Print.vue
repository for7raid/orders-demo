<template>
  <div>
    <div v-for="(object, index) in order.objects" :key="object.id">
      <div class="style1">
        Задание на
        <span style="font-weight: 600"
          >УФ Печать №{{ order.id }} {{ order.name }}</span
        >
        от {{ formatDateTime(order.date) }}, {{ order.user.name }}
      </div>
      <br />
      <div style="text-align: left">
        Клиент: {{ order.client.name }}, {{ order.client.contacts }},
        {{ order.client.address }}
        <br />

        <span v-if="order.receiver.name || order.receiver.address">
          Получатель: {{ order.receiver.name }}, {{ order.receiver.contacts }},
          {{ order.receiver.address }}
          <br />
          <br />
        </span>
      </div>
      <br />
      <div style="font-weight: 600; font-size: 16px">
        Объект {{ object.index }}. {{ object.name }}
      </div>
      <table bordercolor="black" border="1" cellspacing="0">
        <thead>
          <tr style="font-weight: bold">
            <td>#</td>
            <td>Название</td>
            <td>Материал</td>
            <td>Стороны</td>
            <td>Размер, ШхВ</td>
            <td>Кол-во</td>
            <td>Фреза</td>
            <td>Отверстия</td>
            <td>Гибка, м.</td>
            <td>Макет</td>
            <td>Примечания</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in object.items"
            :key="item.id"
            :class="{ 'line-through': item.isCanceled }"
          >
            <td>
              {{ object.index }}.{{ item.index.toString().padStart(2, "0") }}
            </td>
            <td class="wrap">{{ item.name }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.sides }}</td>
            <td>
              {{ formatDecimal(item.width) }}x{{ formatDecimal(item.height) }}
              мм.
            </td>
            <td class="textCenter">{{ item.count }}</td>
            <td class="textCenter">{{ item.cutting.do ? "ДА" : "" }}</td>
            <td class="textCenter">{{ item.holes.count }}</td>
            <td class="textCenter">{{ formatDecimal(item.bending.length) }}</td>
            <td class="wrap">{{ item.source }}</td>
            <td class="wrap">{{ item.description }}</td>
          </tr>
        </tbody>
      </table>

      <hr class="pagebreakhere" v-if="order.objects.length - 1 != index" />
      <p class="pagebreakhere" v-if="order.objects.length - 1 != index" />
      <br />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { formatDateTime, formatDecimal } from "@/utils/format";
import { UVOrder } from "@/entities/uv/UVOrder";

export default defineComponent({
  props: {
    order: UVOrder,
  },
  setup() {
    return {
      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
    };
  },
});
</script>