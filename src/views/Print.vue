<template>
  <div class="home-contnainer">
     <button onclick="window.print(); return false;">Печать</button>
    <UVOrderPrint :order="order" v-if="order && order.constructor == UVOrder" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from "vue";
import UVOrderPrint from "@/components/uv/Print.vue";

import { OrderBase } from "@/entities/OrderBase";
import { UVOrder } from "@/entities/uv/UVOrder";
import { useRoute } from "vue-router";
import { OrderService } from "@/services/OrderService";

export default defineComponent({
  components: { UVOrderPrint },
  setup() {
    const orderService = inject("OrderService") as OrderService;
    const route = useRoute();
    const id = route.params.id as string;
    const order = ref<OrderBase | undefined>();

    onMounted(async () => {
      order.value = await orderService.find(id);
      setTimeout(() => { 
				window.print();
			}, 500);
    });

    return {
      order,
      UVOrder,
    };
  },
});
</script>

<style lang="scss">
.container {
  top: 0px;
}
.p-menubar {
  display: none;
}

@page { 
    size: A4 landscape;
}

.textCenter {
    text-align: center;
    vertical-align: middle;
    margin: 0px auto;
}

.wrap {
    word-break: break-all;
    min-width: 2cm;
}

.pagebreakhere {
    page-break-before: always;
}
@media print {
  button {
    display: none;
  }
}
</style>