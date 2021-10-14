<template>
  <DataTable
    :value="object.items"
    editMode="row"
    dataKey="id"
    v-model:editingRows="editingRows"
    @rowEditInit="onRowEditInit"
    @rowEditSave="onRowEditSave"
    @rowEditCancel="onRowEditCancel"
    :editing="editingRows.lenght"
    class="p-datatable-sm items-table"
    showGridlines
  >
    <template #header>
      <div class="table-header">
        Макеты
        <Button
          icon="pi pi-plus"
          title="Добавить макет"
          @click="createItem({})"
        />
      </div>
    </template>

    <Column header="#" footer="#" :style="{ width: getColWidth('N') }">
      <template #body="slotProps">
        {{ object.index }}.{{
          slotProps.data.index.toString().padStart(2, "0")
        }}
      </template>
    </Column>

    <Column
      field="name"
      header="Название"
      footer="Название"
      :style="{ width: getColWidth('name') }"
    >
      <template #editor="slotProps">
        <Textarea
          v-model="slotProps.data[slotProps.column.props.field]"
          rows="5"
          cols="35"
        />
      </template>
    </Column>

    <Column
      field="material"
      header="Материал"
      footer="Материал"
      :style="{ width: getColWidth('material') }"
      headerStyle="overflow-wrap: anywhere"
    >
      <template #editor="slotProps">
        <Dropdown
          v-model="slotProps.data[slotProps.column.props.field]"
          :options="UVOrderObjectItem.Materials"
        />
      </template>
    </Column>

    <Column
      field="sides"
      header="Стороны"
      :style="{ width: getColWidth('sides') }"
      headerStyle="overflow-wrap: anywhere"
    >
      <template #editor="slotProps">
        <Dropdown
          v-model="slotProps.data[slotProps.column.props.field]"
          :options="UVOrderObjectItem.Sides"
        />
      </template>
    </Column>

    <Column
      field="width"
      header="Ш, мм."
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('width') }"
    >
      <template #body="slotProps">
        {{ formatDecimal(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data[slotProps.column.props.field]"
          :min="0"
          class="p60px"
          mode="decimal"
          :minFractionDigits="1"
          :maxFractionDigits="1"
        />
      </template>
    </Column>

    <Column
      field="height"
      header="В, мм."
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('height') }"
    >
      <template #body="slotProps">
        {{ formatDecimal(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data[slotProps.column.props.field]"
          :min="0"
          class="p60px"
          mode="decimal"
          :minFractionDigits="1"
          :maxFractionDigits="1"
        />
      </template>
    </Column>

    <Column
      field="square"
      header="S, м2"
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('square') }"
    >
      <template #body="slotProps">
        {{ formatDecimal(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        {{ formatDecimal(slotProps.data[slotProps.column.props.field]) }}
      </template>
    </Column>

    <Column
      field="perimeter"
      header="P, м."
      title="Периметер"
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('perimeter') }"
    >
      <template #body="slotProps">
        {{ formatDecimal(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        {{ formatDecimal(slotProps.data[slotProps.column.props.field]) }}
      </template>
    </Column>

    <Column
      field="count"
      header="Кол-во"
      bodyClass="text-center"
      :style="{ width: getColWidth('count') }"
    >
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data[slotProps.column.props.field]"
          :min="0"
          class="p60px"
          :allowEmpty="false"
        />
      </template>
    </Column>
    <Column
      field="price"
      header="Цена за м2"
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('price') }"
    >
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data[slotProps.column.props.field]"
          :min="0"
          class="p60px"
        />
      </template>
    </Column>
    <Column header="Фреза" :style="{ width: getColWidth('cutting') }">
      <template #body="slotProps">
        <span v-if="slotProps.data.cutting.do">
          P x {{ formatCurrency(slotProps.data.cutting.price) }}
        </span>
      </template>

      <template #editor="slotProps">
        <Checkbox v-model="slotProps.data.cutting.do" :binary="true" /> x
        <InputNumber
          v-model="slotProps.data.cutting.price"
          :min="0"
          class="p60px"
          v-show="slotProps.data.cutting.do"
          suffix="₽"
        />
      </template>
    </Column>

    <Column
      header="Отверстия"
      :style="{ width: getColWidth('holes') }"
      headerStyle="overflow-wrap: anywhere"
    >
      <template #body="slotProps">
        <span v-if="slotProps.data.holes.count">
          {{ slotProps.data.holes.count }}x{{ slotProps.data.holes.price }}₽
        </span>
      </template>
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data.holes.count"
          :min="0"
          class="p60px"
        />x
        <InputNumber
          v-model="slotProps.data.holes.price"
          :min="0"
          class="p60px"
          suffix="₽"
        />
      </template>
    </Column>

    <Column header="Гибка" :style="{ width: getColWidth('bending') }">
      <template #body="slotProps">
        <span v-if="slotProps.data.bending.length">
          {{ formatDecimal(slotProps.data.bending.length) }}x{{
            slotProps.data.bending.price
          }}₽
        </span>
      </template>

      <template #editor="slotProps">
        <Button
          class="p-button-rounded p-button-text"
          icon="pi pi-paypal"
          title="Скопировать периметр"
          click="slotProps.data.bending.length = slotProps.data.perimeter"
          v-show="!slotProps.data.bending.length"
        />
        <InputNumber
          v-model="slotProps.data.bending.length"
          :min="0"
          class="p60px"
          mode="decimal"
          :minFractionDigits="1"
          :maxFractionDigits="2"
        />м. х
        <InputNumber
          v-model="slotProps.data.bending.price"
          :min="0"
          class="p60px"
          suffix="₽"
        />
      </template>
    </Column>

    <Column
      field="source"
      header="Ссылка на макет"
      :style="{ width: getColWidth('source') }"
      bodyStyle="overflow-wrap: anywhere;"
    >
      <template #body="{ data }">
        <span v-html="processLinks(data.source)"></span>
      </template>
      <template #editor="slotProps">
        <Textarea
          v-model="slotProps.data[slotProps.column.props.field]"
          rows="5"
          cols="25"
        />
      </template>
    </Column>

    <Column
      field="description"
      header="Примечание"
      headerStyle="overflow-wrap: anywhere"
      :style="{ width: getColWidth('description') }"
      bodyStyle="overflow-wrap: anywhere;"
    >
      <template #editor="slotProps">
        <Textarea
          v-model="slotProps.data[slotProps.column.props.field]"
          rows="5"
          cols="25"
        />
      </template>
      <template #body="{ data }">
        <span v-html="processLinks(data.description)"></span>
      </template>
    </Column>

    <Column
      field="coefficient"
      header="Скидка/наценка"
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('coefficient') }"
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}%
      </template>
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data[slotProps.column.props.field]"
          :min="-90"
          :max="100"
          class="p60px"
          :allowEmpty="false"
        />
      </template>
    </Column>

    <Column
      field="additionalCost"
      header="Доп. стоим."
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('additionalCost') }"
    >
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        <InputNumber
          v-model="slotProps.data[slotProps.column.props.field]"
          :min="0"
          class="p60px"
          :allowEmpty="false"
        />
      </template>
    </Column>

    <Column
      field="total"
      header="Итого, руб."
      bodyStyle="text-align: right"
      :style="{ width: getColWidth('total') }"
    >
      <template #body="slotProps">
        <Tag severity="danger" v-if="!slotProps.data.total">!</Tag>
        {{ formatCurrency(slotProps.data[slotProps.column.props.field]) }}
      </template>
      <template #editor="slotProps">
        <Tag severity="danger" v-if="!slotProps.data.total">!</Tag>
        {{ formatCurrency(slotProps.data[slotProps.column.props.field]) }}
      </template>
    </Column>
    <Column
      header="Статус"
      headerStyle="overflow-wrap: anywhere"
      bodyStyle="overflow-wrap: anywhere"
      :style="{ width: getColWidth('status') }"
    >
      <template #body="slotProps">
        <span
          :class="'order-stauts-badge order-status-' + slotProps.data.status"
          :title="getStatusName(slotProps.data.status)"
          >{{ getStatusName(slotProps.data.status) }}</span
        >

        <Inplace :closable="true" class="inline">
          <template #display>
            <span class="text-xs">См. историю</span>
          </template>
          <template #content>
            <div v-for="item in slotProps.data.history" :key="item.date">
              {{ formatDateTime(item.date) }} {{ item.user.name }}
              {{ getStatusName(item.status) }}
            </div>
          </template>
        </Inplace>
      </template>
       <template #editor="slotProps">
       {{slotProps.data.status}}
      </template>
    </Column>

    <Column
      :rowEditor="true"
      style="width: 40px"
      bodyStyle="text-align:center"
    ></Column>
    <Column style="width: 100px">
      <template #body="slotProps">
        <Button
          class="p-button-rounded p-button-text"
          icon="pi pi-trash"
          title="Удалить"
          @click="removeItem(slotProps.data)"
        />
        <Button
          class="p-button-rounded p-button-text"
          icon="pi pi-clone"
          title="Скопировать"
          @click="createItem(slotProps.data)"
        />
      </template>
    </Column>

    <ColumnGroup type="footer">
      <Row>
        <Column>
          <template #footer>
            <Button
              icon="pi pi-plus"
              title="Добавить макет"
              @click="createItem({})"
            />
          </template>
        </Column>
        <Column
          footer="Итого по объекту (исключая отмененные):"
          :colspan="5"
          footerStyle="text-align:right"
        />
        <Column footerStyle="text-align: right">
          <template #footer>
            {{ formatDecimal(object.totalSquare) }}
          </template>
        </Column>
        <Column />
        <Column :footer="object.totalCount" footerClass="text-center" />
        <Column :colspan="8" />
        <Column footerStyle="text-align: right">
          <template #footer>
            {{ formatCurrency(object.total) }}
          </template>
        </Column>
        <Column />
        <Column :colspan="2">
          <template #footer>
            <Button
              icon="pi pi-plus"
              title="Добавить макет"
              @click="createItem({})"
            />
          </template>
        </Column>
      </Row>
    </ColumnGroup>
  </DataTable>
  <ConfirmDialog group="item"></ConfirmDialog>
</template>


<script lang="ts">
import { defineComponent, inject, nextTick, ref, toRefs } from "vue";
import {
  formatCurrency,
  formatDateTime,
  formatDecimal,
  processLinks,
} from "@/utils/format";
import { UVOrderObject } from "@/entities/uv/UVOrderObject";
import { UVOrderObjectItem } from "@/entities/uv/UVOrderObjectItem";
import { UVOrderObjectItemStatus } from "@/entities/uv/UVOrderObjectItemStatus";
import { useConfirm } from "primevue/useconfirm";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { UserProvider } from "@/providers/UserProvider";

export default defineComponent({
  props: {
    object: {
      required: true,
      type: UVOrderObject,
    },
  },
  setup(props) {
    const userProvider = inject("UserProvider") as UserProvider;
    const { object } = toRefs(props);
    const editingRows = ref<UVOrderObjectItem[]>([]);
    const originalRows: {
      [index: string]: UVOrderObjectItem;
    } = {};
    const confirm = useConfirm();

    const getStatusName = (statusId: number) => {
      return UVOrderObjectItemStatus[statusId];
    };

    const readTableWidth: {
      [index: string]: number;
    } = {
      N: 40,
      name: 250,
      material: 120,
      sides: 40,
      width: 40,
      height: 40,
      square: 40,
      perimeter: 40,
      count: 40,
      price: 60,
      cutting: 60,
      holes: 60,
      bending: 60,
      source: 200,
      description: 200,
      coefficient: 60,
      additionalCost: 60,
      total: 60,
      status: 200,
    };

    const editTableWidth: {
      [index: string]: number;
    } = {
      N: 40,
      name: 250,
      material: 120,
      sides: 82,
      width: 62,
      height: 62,
      square: 60,
      perimeter: 60,
      count: 62,
      price: 62,
      cutting: 65,
      holes: 65,
      bending: 65,
      source: 200,
      description: 200,
      coefficient: 60,
      additionalCost: 60,
      total: 60,
      status: 60,
    };

    const getColWidth = (field: string) => {
      const data = editingRows.value.length ? editTableWidth : readTableWidth;
      return data[field] + "px";
    };

    const removeItem = (item: UVOrderObjectItem) => {
      confirm.require({
        message: `Вы действительно хотите удалить макет №${
          object.value.index
        }.${item.index.toString().padStart(2, "0")} '${item.name}'?`,
        header: "Удаление объекта",
        icon: "pi pi-exclamation-triangle",
        group: "item",
        accept: async () => {
          object.value.removeItem(item);
        },
      });
    };

    const onRowEditInit = async (event: any) => {

      const current = event.data as UVOrderObjectItem;

      if (!current.canChange) {
        confirm.require({
          message: `Макет "${current.name}" уже находится в работе, вы точно хотите внести изменения?`,
          header: "Удаление объекта",
          icon: "pi pi-exclamation-triangle",
          group: "item",
          accept: () => {
            current.markChanged(userProvider.currentUser);
          },
          reject: () => {
            editingRows.value = editingRows.value.filter(
              (i) => i.id !== current.id
            );
          },
        });
      }
    };

    const onRowEditCancel = (event: any) => {
      // const original = originalRows[event.data.id];
      // const index = object.value.items.indexOf(event.data);
      // if (index > -1) {
      //   object.value.items[index]= original;
      // }
    };

    const onRowEditSave = (event: any) => {
      
     plainToClassFromExist(event.data, event.newData, { excludePrefixes: ['id', 'status', 'history'] });
     (event.data as UVOrderObjectItem).invalidate();
    };

    const createItem = async (item: UVOrderObjectItem) => {
      const count = object.value.createItem(userProvider.currentUser, item);
      const newItem = object.value.items[count - 1];
      const original = plainToClass(UVOrderObjectItem, { ...newItem });
      originalRows[original.id] = original;
      editingRows.value = [newItem];
    };

    return {
      UVOrderObjectItem,
      editingRows,
      getColWidth,
      getStatusName,
      createItem,
      removeItem,
      onRowEditInit,
      onRowEditCancel,
      onRowEditSave,
      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
      formatCurrency: formatCurrency,
      processLinks: processLinks,
    };
  },
});
</script>

<style>
.p-cell-editing .p60px,
.p-cell-editing .p60px .p-inputtext {
  width: 60px;
  padding: 6px 1px;
}

.p-selectable-row.p-highlight .p-button.p-button-text {
  color: black;
}


.items-table {
  overflow-x: scroll;
}

.items-table table {
  min-width: 1300px;
}
</style>