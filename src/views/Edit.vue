<template>
  <div>
    <UVOrderEdit v-if="order && order.constructor == UVOrder" :order="order" />
    <PrintOrderEdit
      v-if="order && order.constructor == PrintOrder"
      :order="order"
    />

    <div class="font-bold" v-if="order">
      Итоговая* стоимость заказа: {{ formatDecimal(order.total) }} рублей
      <div class="text-sm">* Не включает отмененные макеты</div>
    </div>

    <div class="flex overflow-hidden">
      <Button
        label="Сохранить"
        icon="pi pi-save"
        @click="save"
        class="m-1 flex-none flex"
      />

      <Button
        label="Выгрузить в Excel"
        icon="pi pi-book"
        class="m-1 p-button-success flex-none flex"
        title="Выгрузить в Excel"
        @@click="exportXlsx()"
      />

      <div class="flex-grow-1 flex"></div>

      <Button
        label="Закрыть"
        icon="pi pi-undo"
        @click="close"
        class="m-1 flex-none flex"
      />
    </div>
    <ConfirmDialog></ConfirmDialog>
    <Toast position="center">
      <template #message="slotProps">
        <div class="p-d-flex p-flex-column">
          <div class="p-text-center">
            <h4>{{ slotProps.message.summary }}</h4>
            <p v-html="slotProps.message.detail"></p>
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted, watch } from "vue";

import { OrderBase } from "@/entities/OrderBase";
import { UVOrder } from "@/entities/uv/UVOrder";
import { PrintOrder } from "@/entities/print/PrintOrder";
import { useRoute, useRouter } from "vue-router";
import { IOrderService } from "@/services/IOrderService";
import { UserProvider } from "@/providers/UserProvider";
import { formatDecimal } from "@/utils/format";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import UVOrderEdit from "@/components/uv/Edit.vue";
import PrintOrderEdit from "@/components/print/Edit.vue";

export default defineComponent({
  components: { UVOrderEdit, PrintOrderEdit },
  setup() {
    const router = useRouter();
    const confirm = useConfirm();
    const toast = useToast();

    const orderService = inject("OrderService") as IOrderService;
    const userProvider = inject("UserProvider") as UserProvider;
    const route = useRoute();
    const id = route.params.id as string;
    const order = ref<OrderBase>();
    const hasChanges = ref(false);

    onMounted(async () => {
      if (id == "new") {
        const type = route.query.type;
        if (type == "uv") {
          order.value = new UVOrder(userProvider.currentUser);
        } else if (type == "print") {
          order.value = new PrintOrder(userProvider.currentUser);
        }
      } else {
        order.value = await orderService.find(id);
      }

      const unwatch = watch(
        () => order.value,
        () => {
          hasChanges.value = true;
          unwatch();
        },
        { deep: true }
      );
    });

    const save = async () => {
      const state = order.value!.validate();

      if (!state.isValid) {
        toast.add({
          severity: "error",
          summary: "В заказе есть ошибки",
          detail: state.message,
        });
        return;
      }
      await orderService.save(order.value!);
      router.push("/");
    };
    const close = () => {
      if (hasChanges.value) {
        confirm.require({
          message: `В заказе есть изменения. Вы действительно закрыть заказ без сохранения'?`,
          header: "Выход",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            router.push("/");
          },
        });
      } else {
        router.push("/");
      }
    };

    return {
      order,
      UVOrder,
      PrintOrder,
      save,
      close,

      formatDecimal: formatDecimal,
    };
  },
});
</script>