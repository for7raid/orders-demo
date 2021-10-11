<template>
  <div>
    <div class="font-bold" v-if="order">
      Итоговая* стоимость заказа: {{ formatDecimal(order.total) }} рублей
      <div class="text-sm">* Не включает отмененные макеты</div>
    </div>

    <div class="flex overflow-hidden">
      <Button
        label="Сохранить"
        icon="pi pi-save"
        @click="save"
        class="m-1 flex-none flex"
      />

      <Button
        label="Выгрузить в Excel"
        icon="pi pi-book"
        class="m-1 p-button-success flex-none flex"
        title="Выгрузить в Excel"
        @@click="exportXlsx()"
      />

      <div class="flex-grow-1 flex"></div>

      <Button
        label="Закрыть"
        icon="pi pi-undo"
        @click="close"
        class="m-1 flex-none flex"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from "vue";
import UVOrderWaybill from "@/components/uv/Waybill.vue";

import { OrderBase } from "@/entities/OrderBase";
import { UVOrder } from "@/entities/uv/UVOrder";
import { useRoute } from "vue-router";
import { OrderService } from "@/services/OrderService";
import { UserProvider } from "@/providers/UserProvider";
import { formatDecimal } from "@/utils/format";

export default defineComponent({
  components: { UVOrderWaybill },
  setup() {
    const orderService = inject("OrderService") as OrderService;
    const userProvider = inject("UserProvider") as UserProvider;
    const route = useRoute();
    const id = route.params.id as string;
    const order = ref<OrderBase | undefined>();

    onMounted(async () => {
      if (id == "new") {
        order.value = new UVOrder(userProvider.currentUser);
      } else {
        order.value = await orderService.find(id);
      }
    });

    const save = async () => {};
    const close = () => {};

    return {
      order,
      UVOrder,
      save,
      close,

      formatDecimal: formatDecimal,
    };
  },
});
</script>