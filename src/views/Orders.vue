<template>
  <div class="home-contnainer">
    <div class="home-contnainer-row-1">
      <OrdersTable v-model="selectedOrder" />
    </div>
    <div class="home-contnainer-row-2">
      <UVOrderDetailsTable
        v-if="selectedOrder && selectedOrder.constructor == UVOrder"
        v-model="selectedOrder"
        :order="selectedOrder"
      /> 
      
      <PrintOrderDetailsTable
        v-if="selectedOrder && selectedOrder.constructor == PrintOrder"
        v-model="selectedOrder"
        :order="selectedOrder"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import OrdersTable from "@/components/orders/OrdersTable.vue";
import UVOrderDetailsTable from "@/components/orders/UVOrderDetailsTable.vue";
import PrintOrderDetailsTable from "@/components/orders/PrintOrderDetailsTable.vue";
import { OrderBase } from "@/entities/OrderBase";
import {PrintOrder } from '@/entities/print/PrintOrder';
import { UVOrder } from "@/entities/uv/UVOrder";

export default defineComponent({
  components: {
    OrdersTable,

    UVOrderDetailsTable,
    PrintOrderDetailsTable,
  },
  setup() {
    const selectedOrder = ref<OrderBase | null>(null);
    return {
      selectedOrder,
      UVOrder,
      PrintOrder,
    };
  },
});
</script>

<style scoped>
.home-contnainer {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-self: auto;
  align-items: flex-start;
  align-content: flex-start;
}

.home-contnainer-row-1 {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 60%;
  min-height: 60%;
  overflow: hidden;
  margin: 0;
}

.home-contnainer-row-2 {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 40%;
  min-height: 40%;
  overflow: hidden;
  margin: 0;
}
</style>