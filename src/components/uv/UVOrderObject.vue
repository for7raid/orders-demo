<template>
  <div class="field grid">
    <label class="col-12 mb-2 md:col-2 md:mb-0">Название объекта</label>
    <div class="col-12 md:col-10">
      <InputText v-model="object.name" class="inputfield w-full"></InputText>
    </div>
  </div>

  <UVOrderObjectItemsTable :object="object" />

  <div class="flex overflow-hidden">
    <Button
      label="Удалить этот объект"
      icon="pi pi-trash"
      class="p-button-warning flex-none flex m-1"
      title="Удалить объект"
      @click="removeObject()"
    />
    <Button
      label="Выгрузить этот объект в Excel"
      icon="pi pi-book"
      class="m-1 p-button-success flex-none flex"
      title="Выгрузить этот объект в Excel"
      @@click="exportXlsx()"
    />
    <div class="flex-grow-1 flex"></div>
    <Button
      label="Отменить все макеты этого объекта"
      icon="pi pi-trash"
      class="p-button-secondary m-1 flex-none flex"
      title="Отменить все макеты этого объекта"
      @click="cancelObject()"
    />
  </div>
  <ConfirmDialog group="remove-object"></ConfirmDialog>
</template>


<script lang="ts">
import { defineComponent, inject, toRefs } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { formatDateTime, formatDecimal } from "@/utils/format";
import { UVOrder } from "@/entities/uv/UVOrder";
import { UVOrderObject } from "@/entities/uv/UVOrderObject";
import { UserProvider } from "@/providers/UserProvider";
import UVOrderObjectItemsTable from "@/components/uv/UVOrderObjectItemsTable.vue";

export default defineComponent({
  components: { UVOrderObjectItemsTable },
  props: {
    order: {
      required: true,
      type: UVOrder,
    },
    object: {
      required: true,
      type: UVOrderObject,
    },
  },
  emits: ["remove-object"],
  setup(props, { emit }) {
    const userProvider = inject("UserProvider") as UserProvider;
    const confirm = useConfirm();
    const { object, order } = toRefs(props);
    const removeObject = () => {
      confirm.require({
        message:
          "Вы действительно хоите удалить этот объект со всеми его макетами?",
        header: "Удаление объекта",
        icon: "pi pi-exclamation-triangle",
        group: "remove-object",
        accept: async () => {
          emit("remove-object", object.value);
        },
      });
    };

    const cancelObject = () => {
      confirm.require({
        message: "Вы действительно хоите все макеты этого объекта?",
        header: "Удаление объекта",
        icon: "pi pi-exclamation-triangle",
        group: "remove-object",
        accept: async () => {
          object.value.cancel(userProvider.currentUser);
        },
      });
    };

    return {
      removeObject,
      cancelObject,
      formatDecimal: formatDecimal,
      formatDateTime: formatDateTime,
    };
  },
});
</script>