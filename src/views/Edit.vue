<template>
  <div>
    <UVOrderWaybill
      :order="order"
      v-if="order && order.constructor == UVOrder"
    />
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
    return {
      order,
      UVOrder,
    };
  },
});
</script>