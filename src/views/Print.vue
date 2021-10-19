<template>
  <div class="home-contnainer">
     <button onclick="window.print(); return false;">Печать</button>
    <UVOrderPrint :order="order" v-if="order && order.constructor == UVOrder" />
    <PrintOrderPrint :order="order" v-if="order && order.constructor == PrintOrder" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from "vue";
import UVOrderPrint from "@/components/uv/Print.vue";
import PrintOrderPrint from "@/components/print/Print.vue";

import { OrderBase } from "@/entities/OrderBase";
import { UVOrder } from "@/entities/uv/UVOrder";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { useRoute } from "vue-router";
import { IOrderService } from "@/services/IOrderService";

export default defineComponent({
  components: { UVOrderPrint, PrintOrderPrint},
  setup() {
    const orderService = inject("OrderService") as IOrderService;
    const route = useRoute();
    const id = route.params.id as string;
    const order = ref<OrderBase>();

    onMounted(async () => {
      order.value = await orderService.find(id);
      setTimeout(() => { 
				window.print();
			}, 500);
    });

    return {
      order,
      UVOrder,
      PrintOrder
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