<template>
  <div style="height: 100%">
    <DataTable
      :value="orders"
      @row-dblclick="editOrder($event.data.id)"
      dataKey="id"
      class="p-datatable-sm"
      responsiveLayout="scroll"
      :scrollable="true"
      scrollHeight="flex"
      :paginator="true"
      :rows="50"
      paginatorPosition="top"
      :rowsPerPageOptions="[5, 20, 50, 100, 200]"
      currentPageReportTemplate="Показано с {first} до {last} из {totalRecords}"
      v-model:selection="selectedOrder"
      selectionMode="single"
      @row-select="rowSelect"
      :loading="isLoading"
      v-model:filters="filters"
      filterDisplay="menu"
    >
      <Column field="id" header="#" style="flex: 10 10 10px">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @input="filterCallback()"
            class="p-column-filter"
          />
        </template>
      </Column>

      <Column field="name" header="Заказ" style="flex: 15 15 15%">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Искать по имени"
          />
        </template>
      </Column>

      <Column field="client" header="Клиент/Плательщик" style="flex: 15 15 15%">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Искать по клиенту"
          />
        </template>
      </Column>

      <Column field="receiver" header="Получатель" style="flex: 30 30 30%">
        <template #body="slotProps">
          {{ slotProps.data.receiver }} {{ slotProps.data.receiverContacts }}
          {{ slotProps.data.receiverAddress }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Искать по получателю"
          />
        </template>
      </Column>

      <Column
        field="statuses"
        header="Статус"
        bodyStyle="padding: 0;"
        style="flex: 2 2 100px"
        :filterMatchModeOptions="[{ label: 'Статус', value: 'STATUS_FILTER' }]"
      >
        <template #body="slotProps">
          <span
            v-for="status in slotProps.data.statuses"
            :class="'order-stauts-badge order-status-' + status"
            :key="status"
            :title="getStatusName(status)"
            @click="showMenu(slotProps.data, $event)"
          ></span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            :options="allStatuses"
            @change="filterCallback()"
            optionLabel="name"
            placeholder="Фильтр по статусу"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div class="p-multiselect-representative-option">
                <span
                  :class="
                    'order-stauts-badge order-status-' + slotProps.option.value
                  "
                  >{{ slotProps.option.name }}</span
                >
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column
        style="flex: 2 2 100px"
        bodyClass="text-900"
        bodyStyle="padding: 0;"
      >
        <template #body="slotProps">
          <Button
            class="p-button-rounded p-button-text"
            icon="pi pi-pencil mr-2 p-0"
            title="Изменить"
            @click="editOrder(slotProps.data.id)"
          />

          <Button
            class="p-button-rounded p-button-text"
            icon="pi pi-print mr-2 p-0"
            title="Задание на печать"
            @click="printOrder(slotProps.data.id)"
          />
          <Button
            class="p-button-rounded p-button-text"
            icon="pi pi-book mr-2 p-0"
            title="Выгрузить в Excell"
            @click="exportOrder(slotProps.data)"
          />
          <Button
            class="p-button-rounded p-button-text"
            icon="pi pi-briefcase mr-2 p-0"
            title="Накладная"
            @click="waybillOrder(slotProps.data.id)"
          />
        </template>
      </Column>

      <template #paginatorLeft>
        <span class="flex">
          <span class="text-lg text-900 align-self-center">Все заказы</span>
          <Button
            label="Новый УФ заказ"
            icon="pi pi-plus"
            class="ml-2 align-self-center"
            @click="newOrder('uv')"
          />
           <Button
            label="Новый ШФ заказ"
            icon="pi pi-plus"
            class="ml-2 align-self-center"
            @click="newOrder('print')"
          />
        </span>
      </template>
      <template #paginatorRight>
        <span class="flex">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Поиск по заказам"
            />
          </span>
          <Button
            type="button"
            icon="pi pi-refresh"
            class="p-button-text align-self-center"
            @click="loadData"
            title="Обновить таблицу"
          />
        </span>
      </template>
      <template #empty> Заказы не найдены. </template>
      <template #loading> Подождите, идёт загрузка заказов. </template>
    </DataTable>
    <ConfirmDialog></ConfirmDialog>
    <Menu ref="menu" :model="menuItems" :popup="true" />
  </div>
</template>

<script lang="ts">
import { OrderBase } from "@/entities/OrderBase";
import { XlsxService } from "@/services/XlsxService";

import { nextTick, defineComponent, inject, ref } from "vue";
import { FilterMatchMode, FilterService } from "primevue/api";
import { UVOrderObjectItemStatus } from "@/entities/uv/UVOrderObjectItemStatus";
import { UVOrder } from "@/entities/uv/UVOrder";
import Menu from "primevue/menu";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { IOrderService } from "@/services/IOrderService";

export default defineComponent({
  name: "OrdersTable",
  setup(props, { emit }) {
    const xlsx = new XlsxService();
    const orderService = inject("OrderService") as IOrderService;
    const orders = ref<OrderBase[]>([]);
    const selectedOrder = ref<OrderBase | undefined>();
    const isLoading = ref(false);
    const menu = ref<Menu>();
    const router = useRouter();
    const confirm = useConfirm();

    async function loadData() {
      isLoading.value = true;
      const selectedId = selectedOrder.value ? selectedOrder.value.id : null;
      selectedOrder.value = undefined;
      orders.value = await orderService.getAll();
      if (selectedId) {
        selectedOrder.value = orders.value.filter((o) => o.id == selectedId)[0];
      }
      isLoading.value = false;
    }
    loadData();
    setInterval(loadData, 5 * 60 * 1000); //Автообновление каждые 5 минут

    const STATUS_FILTER = ref("STATUS_FILTER");

    (FilterService as any).register(
      STATUS_FILTER.value,
      (value: any, filter: any) => {
        if (filter === undefined || filter === null || !filter.length) {
          return true;
        }

        if (value === undefined || value === null || !value.length) {
          return false;
        }

        return value.some((s: any) => filter.some((f: any) => f.value == s));
      }
    );
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: { value: null, matchMode: FilterMatchMode.EQUALS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      client: { value: null, matchMode: FilterMatchMode.CONTAINS },
      receiver: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      statuses: { value: null, matchMode: STATUS_FILTER.value },
    });

    function getStatusName(status: number) {
      return (UVOrderObjectItemStatus as any)[status];
    }

    const allStatuses = Object.keys(UVOrderObjectItemStatus).map((s) => {
      return { value: Number(s), name: (UVOrderObjectItemStatus as any)[s] };
    });

    function rowSelect(row: any) {
      const data = row.data;
      emit("update:modelValue", data);
    }

    const getIsMenuItemDisabled = () => {
      const order = selectedOrder.value;
      if (!order) return true;
      if (order instanceof PrintOrder) return false;
      return !(order as UVOrder).canProcess;
    };
    const startOrder = async () => {
      await orderService.startOrder(selectedOrder.value!);
    };
    const dispatchOrder = async () => {
      await orderService.dispatchOrder(selectedOrder.value!);
    };
    const cancellOrder = () => {
      confirm.require({
        message: `Вы действительно хотите полностью отменить весь заказ №${
          selectedOrder.value!.id
        } '${selectedOrder.value!.name}'?`,
        header: "Отмена заказа",
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          await orderService.cancellOrder(selectedOrder.value!);
        },
      });
    };
    const waybillOrder = (id: number) => {
      window.open("/#/waybill/" + id, "_blank");
    };
    const menuItems = [
      {
        label: "Принять в работу",
        command: startOrder,
        get disabled() {
          return getIsMenuItemDisabled();
        },
      },
      {
        label: "Отгрузить",
        command: dispatchOrder,
        get disabled() {
          return getIsMenuItemDisabled();
        },
      },
      {
        label: "Выгрузить накаладную",
        command: () => {
          waybillOrder(selectedOrder.value!.id);
        },
        get disabled() {
          return getIsMenuItemDisabled();
        },
      },
      { separator: true },
      {
        label: "Отменить весь заказ",
        command: cancellOrder,
      },
    ];

    const showMenu = async (order: UVOrder, event: any) => {
      menu.value!.hide();
      selectedOrder.value = order;
      await nextTick();
      menu.value!.show(event);
    };

    const editOrder = (id: number) => {
      router.push("/edit/" + id);
    };
    
    const newOrder = (type: string) => {
      router.push("/edit/new?type=" + type);
    };

    const printOrder = (id: number) => {
      window.open("/#/print/" + id, "_blank");
    };
    const exportOrder = async (order: OrderBase) => {
      xlsx.export(order);
    };
    return {
      orders,
      selectedOrder,
      isLoading,
      filters,
      menu,
      menuItems,

      loadData,
      getStatusName,
      allStatuses,
      rowSelect,
      showMenu,
      editOrder,
      newOrder,
      printOrder,
      waybillOrder,
      exportOrder,
    };
  },
});
</script>