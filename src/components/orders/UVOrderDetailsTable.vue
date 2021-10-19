<template>
  <div style="height: 100%;">
    <DataTable
      :value="allItems"
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
          {{ order.user.name }}
          {{ formatDateTime(order.date) }}</span
        >
      </template>

      <Column header="#" style="flex: 1 1 40px">
        <template #body="slotProps">
          {{ slotProps.data.object.index }}.{{
            slotProps.data.index.toString().padStart(2, "0")
          }}
        </template>
      </Column>

      <Column
        field="object.name"
        header="Объект"
        sortable
        style="flex: 15 15"
      />
      <Column field="name" header="Название" style="flex: 25 25" />
      <Column
        field="material"
        header="Материал"
        style="flex: 2 2 80px"
      ></Column>
      <Column field="sides" header="Стороны" style="flex: 1 1 40px" />

      <Column header="ШхВ" style="flex: 2 2 80px">
        <template #body="slotProps">
          {{ slotProps.data.width }}x{{ slotProps.data.height }} мм.
        </template>
      </Column>

      <Column
        field="count"
        header="Кол-во"
        bodyClass="justify-content-center"
        style="flex: 1 1 40px"
      />

      <Column header="Фреза" style="flex: 1 1 40px">
        <template #body="slotProps">
          <span v-if="slotProps.data.cutting.do"> V </span>
        </template>
      </Column>

      <Column header="Отверстия" style="flex: 1 1 40px">
        <template #body="slotProps">
          <span v-if="slotProps.data.holes.count">
            {{ slotProps.data.holes.count }} шт.
          </span>
        </template>
      </Column>

      <Column header="Гибка" style="flex: 1 1 40px">
        <template #body="slotProps">
          <span v-if="slotProps.data.bending.length">
            {{ formatDecimal(slotProps.data.bending.length) }} м.
          </span>
        </template>
      </Column>

      <Column
        field="source"
        header="Ссылка на макет"
        bodyStyle="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
        style="flex: 20 20"
      >
        <template #body="{ data }">
          <span v-html="processLinks(data.source)" :title="data.source"></span>
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
        style="flex: 1 1 40px"
      >
        <template #body="{ data }">
          <span
            v-if="order.status != 65"
            :class="'order-stauts-badge order-status-' + data.status"
            :title="getStatusName(data.status)"
            @click="showItemMenu(data, $event)"
          ></span>
          <span
            v-else
            :class="'order-stauts-badge order-status-' + order.status"
            :title="getStatusName(order.status)"
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
import { UVOrderObjectItemStatus } from "@/entities/uv/UVOrderObjectItemStatus";
import { UVOrder } from "@/entities/uv/UVOrder";
import { UVOrderObjectItem } from "@/entities/uv/UVOrderObjectItem";
import { formatDateTime, processLinks, formatDecimal } from "@/utils/format";
import Menu from "primevue/menu";

export default defineComponent({
  name: "UVOrderDetailsTable",
  props: {
    order: UVOrder,
  },
  setup(props) {
    const orderService = inject("OrderService") as IOrderService;
    const selectedOrderItem = ref<UVOrderObjectItem | undefined>();
    const { order } = toRefs(props);
    const allItems = computed(() =>
      order.value?.objects?.reduce((acc, cur) => {
        let newItems = cur.items;
        newItems.forEach((i) => (i.object = cur));
        acc.push(...newItems);
        return acc;
      }, [] as UVOrderObjectItem[])
    );
    const menu = ref<Menu>();

    const getStatusName = (status: number) => {
      return (UVOrderObjectItemStatus as any)[status];
    };

    const showItemMenu = async (item: UVOrderObjectItem, event: any) => {
      menu.value!.hide();
      if (!order.value || order.value.isCalculating) return;
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
      allItems,
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