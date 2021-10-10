<template>
  <div class="home-contnainer">
    <button onclick="window.print(); return false;">Печать</button>
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

export default defineComponent({
  components: { UVOrderWaybill },
  setup() {
    const orderService = inject("OrderService") as OrderService;
    const route = useRoute();
    const id = route.params.id as string;
    const order = ref<OrderBase | undefined>();

    onMounted(async () => {
      order.value = await orderService.find(id);
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
body {
  font-family: "Times New Roman", Times, serif, Arial;
  font-size: 14px;
}

input[type="text"],
textarea {
  resize: vertical;
  font-family: "Times New Roman", Times, serif, Arial;
  font-size: 14px;
  width: 23cm;
}

input[type="text"] {
  resize: none;
  vertical-align: top;
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