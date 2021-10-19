<template>
  <div style="height: 100%">
    <DataTable
      :value="order.items"
      dataKey="id"
      class="p-datatable-sm"
      responsiveLayout="scroll"
      :scrollable="true"
      scrollHeight="flex"
      v-model:selection="selectedOrderItem"
      selectionMode="single"
      showGridlines
    >
      <template #header>
        <span v-if="order"
          >Заказ №{{ order.id }} "{{ order.name }}" принял
          {{ order.user.name }} {{ formatDateTime(order.date) }}</span
        >
      </template>

      <Column header="#" style="flex: 1 1 40px">
        <template #body="slotProps">
          {{ slotProps.data.index.toString().padStart(2, "0") }}
        </template>
      </Column>

      <Column field="name" header="Название" style="flex: 20 20" />
      <Column
        field="count"
        header="Кол-во"
        bodyClass="justify-content-center"
        style="flex: 1 1 40px"
      />
      <Column field="material" header="Материал" style="flex: 20 20">
        <template #body="{ data }">
          <span>
            <span>{{ data.materialType }}</span>
            <span v-if="data.materialSubType"
              >, {{ data.materialSubType }}</span
            >
            <span v-if="data.materialProperties"
              >, {{ data.materialProperties }}</span
            >
          </span>
        </template>
      </Column>

      <Column
        field="density"
        header="Плотность"
        bodyClass="justify-content-center"
        style="flex: 1 1 60px"
      />

      <Column header="ШхВ" style="flex: 2 2 120px">
        <template #body="{ data }">
          <span>
            <span
              >{{ data.width }}x{{ data.height }}м.,
              {{ data.resolution }}dpi</span
            ><span v-if="data.doubleSquare">, Двойная площадь!</span>
          </span>
        </template>
      </Column>

      <Column header="Постобработка" style="flex: 2 2 120px">
        <template #body="{ data }">
          <span>
            <span v-if="data.pocket.has">К [{{ data.pocket }}]; </span>
            <span v-if="data.holes.has">Л [{{ data.holes }}]; </span>
            <span v-if="data.strengthening.has"
              >У [{{ data.strengthening }}];
            </span>
            <span v-if="data.welding.has">П [{{ data.welding }}];</span>
          </span>
        </template>
      </Column>

      <Column
        field="description"
        header="Примечание"
        bodyStyle="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
        style="flex: 20 20"
      >
        <template #body="{ data }">
          <span
            v-html="processLinks(data.description)"
            :title="data.description"
          ></span>
        </template>
      </Column>

      <Column
        field="status"
        header=""
        sortable
        bodyStyle="padding: 0;"
        style="flex: 1 1 60px"
      >
        <template #body="slotProps">
          <span
            :class="'order-stauts-badge order-status-' + slotProps.data.status"
            :title="getStatusName(slotProps.data.status)"
            @click="showItemMenu(slotProps.data, $event)"
          ></span>
        </template>
      </Column>
    </DataTable>
    <Menu ref="menu" :model="itemMenuItems" :popup="true" />
  </div>
</template>

<script lang="ts">
import { IOrderService } from "@/services/IOrderService";
import { defineComponent, inject, ref, toRefs, computed, nextTick } from "vue";
import { PrintOrderItemStatus } from "@/entities/print/PrintOrderItemStatus";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { formatDateTime, processLinks, formatDecimal } from "@/utils/format";
import Menu from "primevue/menu";
import { PrintOrderItem } from "@/entities/print/PrintOrderItem";

export default defineComponent({
  name: "PrintOrderDetailsTable",
  props: {
    order: PrintOrder,
  },
  setup(props) {
    const orderService = inject("OrderService") as IOrderService;
    const selectedOrderItem = ref<PrintOrderItem>();
    const { order } = toRefs(props);

    const menu = ref<Menu>();

    const getStatusName = (status: number) => {
      return PrintOrderItemStatus[status];
    };

    const showItemMenu = async (item: PrintOrderItem, event: any) => {
      menu.value!.hide();
      selectedOrderItem.value = item;
      await nextTick();
      menu.value!.show(event);
    };

    const startItem = async () => {
      await orderService.startItem(order.value!, selectedOrderItem.value);
    };

    const finishItem = async () => {
      await orderService.finishItem(order.value!, selectedOrderItem.value);
    };

    const dispatchItem = async () => {
      await orderService.dispatchItem(order.value!, selectedOrderItem.value);
    };

    const mistakeItem = async () => {
      await orderService.mistakeItem(order.value!, selectedOrderItem.value);
    };

    const cancelItem = async () => {
      await orderService.cancelItem(order.value!, selectedOrderItem.value);
    };
    const itemMenuItems = [
      {
        label: "Принять в работу",
        command: startItem,
        get disabled() {
          return !selectedOrderItem.value!.canStart;
        },
      },
      {
        label: "Готово",
        command: finishItem,
        get disabled() {
          return !selectedOrderItem.value!.canFinish;
        },
      },
      {
        label: "Отгрузить",
        command: dispatchItem,
        get disabled() {
          return !selectedOrderItem.value!.canDispatch;
        },
      },
      {
        label: "Ошибочный заказ",
        command: mistakeItem,
        get disabled() {
          return !selectedOrderItem.value!.canCancel;
        },
      },
      {
        label: "Отменить заказ",
        command: cancelItem,
        get disabled() {
          return !selectedOrderItem.value!.canTotalCancel;
        },
      },
    ];

    return {
      order,
      selectedOrderItem,
      itemMenuItems,
      menu,

      getStatusName,
      showItemMenu,

      formatDateTime,
      processLinks,
      formatDecimal,
    };
  },
});
</script>